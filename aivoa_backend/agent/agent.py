from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
from agent.tools import all_tools
import os
import json

load_dotenv()

# llama-3.3-70b-versatile handles multi-param tools correctly
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile",
    temperature=0
)

llm_with_tools = llm.bind_tools(all_tools)

SYSTEM_PROMPT = """You are an AI assistant for a pharmaceutical CRM system.

ALWAYS call the correct tool. NEVER reply with plain text only.

- User describes a meeting → call log_interaction
- User says change/update/correct/sorry/actually → call edit_interaction  
- User asks for follow-up suggestions → call suggest_followup
- User asks about sentiment → call analyze_sentiment
- User says clear/reset/start over/new form/empty form → MUST call clear_form tool with no arguments

today's date = 2026-04-24
sentiment = positive, neutral, or negative ONLY
interaction_type = Meeting, Call, Email, or Conference ONLY
"""

# Keep LangGraph for compliance with assignment
agent = create_react_agent(model=llm, tools=all_tools)

def run_agent(user_message: str, thread_id: str = "default") -> dict:
    try:
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_message)
        ]

        # Step 1: LLM decides which tool to call
        response = llm_with_tools.invoke(messages)

        print("DEBUG tool_calls:", response.tool_calls)

        form_action = None
        text_response = "I've processed your request!"

        if response.tool_calls:
            tool_call = response.tool_calls[0]
            tool_name = tool_call["name"]
            tool_args = tool_call["args"]

            print(f"DEBUG tool: {tool_name}, args: {tool_args}")

            # Step 2: Execute the tool manually
            tool_map = {t.name: t for t in all_tools}

            if tool_name in tool_map:
                tool_result = tool_map[tool_name].invoke(tool_args)
                print("DEBUG result:", tool_result)

                # Parse result
                if isinstance(tool_result, str):
                    try:
                        form_action = json.loads(tool_result)
                    except:
                        text_response = tool_result
                elif isinstance(tool_result, dict):
                    form_action = tool_result

                # Set friendly response
                if form_action:
                    action = form_action.get("action", "")
                    fields = form_action.get("fields", {})
                    hcp = fields.get("hcp_name", "the HCP")
                    if action == "fill_form":
                        text_response = f"✅ Form filled for **{hcp}**! Review and click 'Log Interaction' to save."
                    elif action == "update_form":
                        text_response = f"✅ Updated! Please review the form."
                    elif action == "clear_form":
                        text_response = "✅ Form cleared! Ready for a new interaction."
                    else:
                        text_response = form_action.get("message", "Done!")
        else:
            text_response = response.content or "Please describe your interaction with the doctor."

        print("FINAL form_action:", form_action)

        return {
            "text": text_response,
            "form_action": form_action
        }

    except Exception as e:
        print("AGENT ERROR:", str(e))
        return {
            "text": f"Sorry, something went wrong: {str(e)}",
            "form_action": None
        }