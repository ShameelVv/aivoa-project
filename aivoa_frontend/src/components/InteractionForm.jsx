// InteractionForm.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveInteraction } from '../store/interactionSlice'


  // Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

// Helper to get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date()
  return now.toTimeString().slice(0, 5)
}


const InteractionForm = () => {
  const dispatch = useDispatch()
  const { loading, formData } = useSelector((state) => state.interactions)


  const emptyForm = {
    hcp_name: '',
    interaction_type: 'Meeting',
    date: getTodayDate(),      
    time: getCurrentTime(),    
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'neutral',
    outcomes: '',
    follow_up_actions: '',
  }

  const [form, setForm] = useState(emptyForm)
  const [success, setSuccess] = useState(false)

  // ✨ THE MAGIC — when Redux formData changes, auto-fill the form
  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return

    // If clear action, reset everything
    if (formData._clear === true) {
      setForm(emptyForm)
      return
    }

    // Otherwise merge fields into form
    setForm(prev => {
      const updated = { ...prev }
      Object.keys(formData).forEach(key => {
        if (formData[key] !== "" && formData[key] !== undefined) {
          updated[key] = formData[key]
        }
      })
      // Validate interaction_type
      if (formData.interaction_type && !['Meeting','Call','Email','Conference'].includes(formData.interaction_type)) {
        updated.interaction_type = prev.interaction_type
      }
      // Validate sentiment
      if (formData.sentiment && !['positive','neutral','negative'].includes(formData.sentiment)) {
        updated.sentiment = prev.sentiment
      }
      return updated
    })
  }, [formData])

  // User can still manually edit any field after AI fills it
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Save to database when user clicks Log Interaction
  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(saveInteraction(form))
    if (result.meta.requestStatus === 'fulfilled') {
      setSuccess(true)
      setForm(emptyForm)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Log HCP Interaction</h2>

      {success && (
        <div style={styles.successBanner}>
          ✅ Interaction logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <p style={styles.sectionLabel}>Interaction Details</p>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>HCP Name *</label>
            <input
              style={styles.input}
              name="hcp_name"
              value={form.hcp_name}
              onChange={handleChange}
              placeholder="Search or select HCP..."
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Interaction Type</label>
            <select
              style={styles.input}
              name="interaction_type"
              value={form.interaction_type}
              onChange={handleChange}
            >
              <option>Meeting</option>
              <option>Call</option>
              <option>Email</option>
              <option>Conference</option>
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input
              style={styles.input}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Time</label>
            <input
              style={styles.input}
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Attendees</label>
          <input
            style={styles.input}
            name="attendees"
            value={form.attendees}
            onChange={handleChange}
            placeholder="Enter names or search..."
          />
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Topics Discussed</label>
          <textarea
            style={styles.textarea}
            name="topics_discussed"
            value={form.topics_discussed}
            onChange={handleChange}
            placeholder="Enter key discussion points..."
            rows={3}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Materials Shared</label>
            <input
              style={styles.input}
              name="materials_shared"
              value={form.materials_shared}
              onChange={handleChange}
              placeholder="Brochures, PDFs..."
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Samples Distributed</label>
            <input
              style={styles.input}
              name="samples_distributed"
              value={form.samples_distributed}
              onChange={handleChange}
              placeholder="Drug samples..."
            />
          </div>
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Observed HCP Sentiment</label>
          <div style={styles.sentimentRow}>
            {['positive', 'neutral', 'negative'].map((s) => (
              <label key={s} style={styles.sentimentOption}>
                <input
                  type="radio"
                  name="sentiment"
                  value={s}
                  checked={form.sentiment === s}
                  onChange={handleChange}
                />
                <span style={{
                  ...styles.sentimentLabel,
                  color: s === 'positive' ? '#22c55e' : s === 'negative' ? '#ef4444' : '#6b7280'
                }}>
                  {s === 'positive' ? '😊' : s === 'negative' ? '😟' : '😐'} {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Outcomes</label>
          <textarea
            style={styles.textarea}
            name="outcomes"
            value={form.outcomes}
            onChange={handleChange}
            placeholder="Key outcomes or agreements..."
            rows={2}
          />
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Follow-up Actions</label>
          <textarea
            style={styles.textarea}
            name="follow_up_actions"
            value={form.follow_up_actions}
            onChange={handleChange}
            placeholder="Enter next steps or tasks..."
            rows={2}
          />
        </div>

        <button
          type="submit"
          style={loading ? styles.buttonDisabled : styles.button}
          disabled={loading}
        >
          {loading ? 'Saving...' : '💾 Log Interaction'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  sectionLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '16px',
  },
  container: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    height: '100%',
    overflowY: 'auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1a1a2e',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '12px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    width: '100%',
  },
  textarea: {
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    resize: 'vertical',
    width: '100%',
  },
  sentimentRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    padding: '8px 0',
  },
  sentimentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  sentimentLabel: {
    fontSize: '14px',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: 'Inter, sans-serif',
  },
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    background: '#9ca3af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginTop: '8px',
    fontFamily: 'Inter, sans-serif',
  },
  successBanner: {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#166534',
    padding: '10px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '500',
  }
  
}

export default InteractionForm