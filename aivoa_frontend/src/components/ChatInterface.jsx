import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  addUserMessage,
  saveFromChat,
} from "../store/interactionSlice";

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { chatMessages, chatLoading, formData, loading } = useSelector(
    (state) => state.interactions,
  );
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput("");
    dispatch(addUserMessage(message));
    dispatch(sendMessage(message));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Save the AI-filled form to database
  const handleSaveInteraction = async () => {
    if (!formData || !formData.hcp_name) return;
    const result = await dispatch(saveFromChat(formData));
    if (result.meta.requestStatus === "fulfilled") {
      setSaved(true);
      // Show success message in chat
      dispatch({
        type: "interactions/sendMessage/fulfilled",
        payload: {
          text: `✅ Interaction with **${formData.hcp_name}** saved to database successfully! ID: ${result.payload.id}`,
          form_action: null,
        },
      });
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // Check if form has data to save
  const formHasData =
    formData && formData.hcp_name && formData.hcp_name.trim() !== "";

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.aiDot} />
          <div>
            <div style={styles.headerTitle}>AI Assistant</div>
            <div style={styles.headerSub}>Log interaction via chat</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {chatMessages.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyBox}>
              <p style={styles.emptyText}>
                Log interaction details here (e.g., "Met Dr. Smith, discussed
                Product X efficacy, positive sentiment, shared brochure") or ask
                for help.
              </p>
            </div>
            <div style={styles.suggestions}>
              <button
                style={styles.suggestion}
                onClick={() =>
                  setInput(
                    "Today I met with Dr. Smith, meeting, discussed OncoBoost efficacy, sentiment positive, shared brochures, he agreed to prescribe",
                  )
                }
              >
                📋 Log a new interaction
              </button>
              <button
                style={styles.suggestion}
                onClick={() =>
                  setInput("Suggest follow-up actions for my last meeting")
                }
              >
                📅 Suggest follow-up actions
              </button>
              <button
                style={styles.suggestion}
                onClick={() =>
                  setInput(
                    "Analyze sentiment: doctor was very interested and asked for more samples",
                  )
                }
              >
                😊 Analyze HCP sentiment
              </button>
            </div>
          </div>
        )}

        {chatMessages.map((msg, index) => (
          <div
            key={index}
            style={msg.role === "user" ? styles.userMessage : styles.aiMessage}
          >
            {msg.role === "assistant" && <div style={styles.aiAvatar}>🤖</div>}
            <div
              style={msg.role === "user" ? styles.userBubble : styles.aiBubble}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div style={styles.aiMessage}>
            <div style={styles.aiAvatar}>🤖</div>
            <div style={styles.aiBubble}>
              <div style={styles.typing}>
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Save button — appears when form has AI-filled data */}
      {formHasData && !formData._clear && (
        <div style={styles.saveBar}>
          <span style={styles.saveBarText}>
            📋 Form filled for <strong>{formData.hcp_name}</strong>
          </span>
          <button
            style={styles.saveButton}
            onClick={handleSaveInteraction}
            disabled={loading}
          >
            {loading ? "Saving..." : "💾 Save Interaction"}
          </button>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe interaction... (Enter to send)"
          rows={2}
        />
        <button
          style={input.trim() ? styles.sendButton : styles.sendButtonDisabled}
          onClick={handleSend}
          disabled={!input.trim() || chatLoading}
        >
          Log
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#ffffff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  header: {
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  aiDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 6px #22c55e",
  },
  headerTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a2e",
  },
  headerSub: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "8px",
  },
  emptyBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "12px",
  },
  emptyText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#3b82f6",
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  suggestion: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    color: "#374151",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "Inter, sans-serif",
  },
  userMessage: {
    display: "flex",
    justifyContent: "flex-end",
  },
  aiMessage: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
  },
  userBubble: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "10px 14px",
    borderRadius: "12px 12px 2px 12px",
    maxWidth: "80%",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  aiBubble: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    color: "#1a1a2e",
    padding: "10px 14px",
    borderRadius: "2px 12px 12px 12px",
    maxWidth: "80%",
    fontSize: "13px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  aiAvatar: {
    fontSize: "20px",
    flexShrink: 0,
  },
  typing: {
    display: "flex",
    gap: "4px",
    fontSize: "18px",
    color: "#9ca3af",
  },
  saveBar: {
    background: "#f0fdf4",
    border: "1px solid #86efac",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  saveBarText: {
    fontSize: "13px",
    color: "#166534",
  },
  saveButton: {
    padding: "8px 16px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap",
  },
  inputArea: {
    padding: "12px 16px",
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    resize: "none",
  },
  sendButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  sendButtonDisabled: {
    padding: "10px 20px",
    background: "#e5e7eb",
    color: "#9ca3af",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "not-allowed",
    fontFamily: "Inter, sans-serif",
  },
};

export default ChatInterface;
