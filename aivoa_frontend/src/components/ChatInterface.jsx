// ChatInterface.jsx
// This is the RIGHT side — the AI chat panel
// Sales reps describe the interaction naturally and the AI logs it

import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage, addUserMessage } from '../store/interactionSlice'

const ChatInterface = () => {
  const dispatch = useDispatch()
  const { chatMessages, chatLoading } = useSelector((state) => state.interactions)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim()) return
    const message = input.trim()
    setInput('')

    // Add user message to chat immediately
    dispatch(addUserMessage(message))

    // Send to AI agent
    dispatch(sendMessage(message))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
            <div style={styles.emptyIcon}>🤖</div>
            <p style={styles.emptyText}>
              Log interaction details here (e.g., "Met Dr. Smith, discussed Product X efficacy,
              positive sentiment, shared brochure") or ask for help.
            </p>
            <div style={styles.suggestions}>
              <button style={styles.suggestion} onClick={() => setInput('Show history for Dr. Sharma')}>
                📋 Show history for Dr. Sharma
              </button>
              <button style={styles.suggestion} onClick={() => setInput('Suggest follow-up for my last meeting')}>
                📅 Suggest follow-up actions
              </button>
              <button style={styles.suggestion} onClick={() => setInput('Analyze sentiment: doctor was very interested and asked for more samples')}>
                😊 Analyze HCP sentiment
              </button>
            </div>
          </div>
        )}

        {chatMessages.map((msg, index) => (
          <div
            key={index}
            style={msg.role === 'user' ? styles.userMessage : styles.aiMessage}
          >
            {msg.role === 'assistant' && (
              <div style={styles.aiAvatar}>🤖</div>
            )}
            <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              {msg.content}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div style={styles.aiMessage}>
            <div style={styles.aiAvatar}>🤖</div>
            <div style={styles.aiBubble}>
              <div style={styles.typing}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
  )
}

const styles = {
  container: {
    background: '#ffffff',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  aiDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  headerSub: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    gap: '12px',
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '32px',
  },
  emptyText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#9ca3af',
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginTop: '8px',
  },
  suggestion: {
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#374151',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Inter, sans-serif',
  },
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  aiMessage: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '12px 12px 2px 12px',
    maxWidth: '80%',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  aiBubble: {
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    color: '#1a1a2e',
    padding: '10px 14px',
    borderRadius: '2px 12px 12px 12px',
    maxWidth: '80%',
    fontSize: '13px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  aiAvatar: {
    fontSize: '20px',
    flexShrink: 0,
  },
  typing: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    padding: '4px 0',
  },
  inputArea: {
    padding: '12px 16px',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    resize: 'none',
  },
  sendButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  sendButtonDisabled: {
    padding: '10px 20px',
    background: '#e5e7eb',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    fontFamily: 'Inter, sans-serif',
  },
}

export default ChatInterface