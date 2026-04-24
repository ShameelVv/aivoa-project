from langchain_core.tools import tool
import json

@tool
def log_interaction(
    hcp_name: str,
    interaction_type: str,
    date: str,
    topics_discussed: str,
    sentiment: str,
    outcomes: str,
    materials_shared: str = "",
    samples_distributed: str = "",
    attendees: str = "",
    time: str = "",
    follow_up_actions: str = ""
) -> str:
    """
    Log a new interaction with a Healthcare Professional (HCP) or doctor.
    Call this when user describes a meeting, call, or visit with a doctor.
    hcp_name: full name of the doctor or HCP
    interaction_type: one of Meeting, Call, Email, Conference
    date: date in YYYY-MM-DD format, use 2026-04-24 for today
    topics_discussed: what was discussed in the meeting
    sentiment: must be exactly one of: positive, neutral, negative
    outcomes: what was agreed or decided
    materials_shared: any brochures or documents shared
    samples_distributed: any drug samples given
    attendees: other people present
    time: time in HH:MM format
    follow_up_actions: next steps planned
    """
    result = {
        "action": "fill_form",
        "fields": {
            "hcp_name": hcp_name,
            "interaction_type": interaction_type,
            "date": date,
            "time": time,
            "attendees": attendees,
            "topics_discussed": topics_discussed,
            "materials_shared": materials_shared,
            "samples_distributed": samples_distributed,
            "sentiment": sentiment,
            "outcomes": outcomes,
            "follow_up_actions": follow_up_actions,
        }
    }
    return json.dumps(result)


@tool
def edit_interaction(
    hcp_name: str = "",
    interaction_type: str = "",
    date: str = "",
    time: str = "",
    attendees: str = "",
    topics_discussed: str = "",
    materials_shared: str = "",
    samples_distributed: str = "",
    sentiment: str = "",
    outcomes: str = "",
    follow_up_actions: str = ""
) -> str:
    """
    Edit or correct specific fields of the current interaction form.
    Call this when user says: sorry, actually, change, update, correct, fix, wrong.
    Only pass the fields that need to be changed. Leave others as empty string.
    sentiment must be exactly: positive, neutral, or negative
    """
    fields = {}
    if hcp_name: fields["hcp_name"] = hcp_name
    if interaction_type: fields["interaction_type"] = interaction_type
    if date: fields["date"] = date
    if time: fields["time"] = time
    if attendees: fields["attendees"] = attendees
    if topics_discussed: fields["topics_discussed"] = topics_discussed
    if materials_shared: fields["materials_shared"] = materials_shared
    if samples_distributed: fields["samples_distributed"] = samples_distributed
    if sentiment: fields["sentiment"] = sentiment
    if outcomes: fields["outcomes"] = outcomes
    if follow_up_actions: fields["follow_up_actions"] = follow_up_actions

    result = {
        "action": "update_form",
        "fields": fields
    }
    return json.dumps(result)


@tool
def suggest_followup(
    hcp_name: str,
    topics_discussed: str,
    sentiment: str
) -> str:
    """
    Suggest follow-up actions after an HCP interaction.
    Call this when user asks: what should I do next, suggest follow-up, next steps.
    hcp_name: name of the doctor
    topics_discussed: what was discussed
    sentiment: positive, neutral, or negative
    """
    if sentiment == "positive":
        suggestions = [
            f"Schedule follow-up meeting with {hcp_name} in 2 weeks",
            f"Send clinical study data related to {topics_discussed}",
            f"Add {hcp_name} to product launch invite list",
        ]
    elif sentiment == "negative":
        suggestions = [
            f"Send reassuring literature to {hcp_name} about concerns",
            f"Schedule a call with medical affairs regarding {topics_discussed}",
        ]
    else:
        suggestions = [
            f"Send follow-up email summarizing discussion with {hcp_name}",
            f"Share relevant materials about {topics_discussed}",
        ]

    follow_up_text = "\n".join(f"• {s}" for s in suggestions)
    result = {
        "action": "update_form",
        "fields": {"follow_up_actions": follow_up_text},
        "message": f"Suggested follow-ups for {hcp_name}:\n{follow_up_text}"
    }
    return json.dumps(result)


@tool
def analyze_sentiment(description: str) -> str:
    """
    Analyze the mood or sentiment of an HCP from interaction description.
    Call this when user asks about doctor's mood, reaction, or sentiment.
    description: text describing how the doctor reacted or felt
    """
    text = description.lower()
    positive_words = ["interested", "positive", "agreed", "enthusiastic",
                      "happy", "receptive", "excited", "willing", "impressed"]
    negative_words = ["refused", "negative", "unhappy", "not interested",
                      "dismissed", "annoyed", "resistant", "skeptical"]

    pos = sum(1 for w in positive_words if w in text)
    neg = sum(1 for w in negative_words if w in text)

    if pos > neg:
        sentiment = "positive"
        message = "😊 Sentiment: POSITIVE — HCP appeared receptive."
    elif neg > pos:
        sentiment = "negative"
        message = "😟 Sentiment: NEGATIVE — HCP appeared resistant."
    else:
        sentiment = "neutral"
        message = "😐 Sentiment: NEUTRAL — HCP response was mixed."

    result = {
        "action": "update_form",
        "fields": {"sentiment": sentiment},
        "message": message
    }
    return json.dumps(result)


@tool
def clear_form() -> str:
    """
    Clear all fields on the form to start a new interaction.
    Call this when user says: clear, reset, start over, new interaction, empty form, fresh start.
    No arguments needed.
    """
    result = {
        "action": "clear_form",
        "fields": {"_clear": True},
        "message": "✅ Form cleared! Ready to log a new interaction."
    }
    return json.dumps(result)


all_tools = [
    log_interaction,
    edit_interaction,
    suggest_followup,
    analyze_sentiment,
    clear_form
]