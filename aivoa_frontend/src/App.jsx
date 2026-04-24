// App.jsx
// Root component — splits the screen into Form (left) and Chat (right)

import InteractionForm from './components/InteractionForm'
import ChatInterface from './components/ChatInterface'

function App() {
  return (
    <div style={styles.page}>
      {/* Top navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLogo}>🏥 AIVOA CRM</div>
        <div style={styles.navTitle}>Log HCP Interaction</div>
        <div style={styles.navBadge}>AI-Powered</div>
      </div>

      {/* Main split layout */}
      <div style={styles.main}>
        {/* Left — Structured Form */}
        <div style={styles.formPanel}>
          <InteractionForm />
        </div>

        {/* Right — AI Chat */}
        <div style={styles.chatPanel}>
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f6fa',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    background: '#ffffff',
    padding: '14px 28px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  navLogo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#667eea',
  },
  navTitle: {
    flex: 1,
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  navBadge: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  main: {
    flex: 1,
    display: 'flex',
    gap: '20px',
    padding: '20px 28px',
    maxHeight: 'calc(100vh - 60px)',
  },
  formPanel: {
    flex: 3,
    overflowY: 'auto',
  },
  chatPanel: {
    flex: 2,
    minWidth: '320px',
  },
}

export default App