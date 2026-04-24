# AIVOA HCP CRM - AI-First Interaction Logger

An AI-powered CRM system for pharmaceutical sales representatives to log interactions with Healthcare Professionals (HCPs) using natural language.

## 🎯 Project Overview

This system features a split-screen interface where:
- **Left Panel** — Structured interaction form
- **Right Panel** — AI Assistant chat that automatically fills the form

The sales rep simply describes their interaction naturally, and the AI extracts all details and populates the form automatically.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Redux Toolkit |
| Backend | Python + FastAPI |
| AI Agent | LangGraph + LangChain |
| LLM | Groq (llama-3.3-70b-versatile) |
| Database | PostgreSQL + SQLAlchemy |
| Font | Google Inter |

## 🤖 LangGraph AI Agent Tools

The LangGraph agent has 5 tools:

1. **log_interaction** — Extracts interaction details from natural language and fills the form
2. **edit_interaction** — Updates specific fields when user makes corrections
3. **suggest_followup** — Generates intelligent follow-up action suggestions
4. **analyze_sentiment** — Detects HCP sentiment from interaction description
5. **clear_form** — Resets all form fields for a new interaction

## 📁 Project Structure

aivoa-project/
├── aivoa_backend/
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # PostgreSQL connection
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── agent/
│   │   ├── agent.py         # LangGraph agent
│   │   └── tools.py         # 5 LangGraph tools
│   └── routes/
│       └── interactions.py  # API endpoints
└── aivoa_frontend/
└── src/
├── App.jsx
├── components/
│   ├── InteractionForm.jsx
│   └── ChatInterface.jsx
├── store/
│   ├── store.js
│   └── interactionSlice.js
└── api/
└── client.js

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
cd aivoa_backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv langchain-groq langgraph pydantic
```

Create `.env` file:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/aivoa_crm
GROQ_API_KEY=your_groq_api_key


Run backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd aivoa_frontend
npm install
npm run dev
```

### Database Setup

```sql
CREATE DATABASE aivoa_crm;
```

Tables are created automatically on first run.

## 🚀 Usage

1. Start backend: `uvicorn main:app --reload` (port 8000)
2. Start frontend: `npm run dev` (port 5173)
3. Open `http://localhost:5173`
4. Type interaction description in AI chat
5. Watch the form auto-fill!

## 💬 Example Chat Prompts

"Today I met with Dr. Smith, discussed OncoBoost efficacy, sentiment was positive, shared brochures"
"Sorry, the name was actually Dr. John and sentiment was negative"
"Suggest follow-up actions for my meeting with Dr. John"
"Analyze sentiment: doctor was very enthusiastic and excited"
"Clear the form"

## 📝 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/interactions | Save interaction |
| GET | /api/interactions | Get all interactions |
| PUT | /api/interactions/{id} | Update interaction |
| POST | /api/chat | Chat with AI agent |

## ⚠️ Note on Model

The assignment specified `gemma2-9b-it` which Groq has decommissioned as of April 2026. This project uses `llama-3.3-70b-versatile` as recommended in the assignment brief as an alternative.