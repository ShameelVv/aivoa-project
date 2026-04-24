# interactions.py
# These are the FastAPI routes (API endpoints)
# Think of routes as doors — each URL path is a door the frontend knocks on

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from agent.agent import run_agent

router = APIRouter()

# ── POST /interactions ────────────────────────────────────────────────────────
# Save a new interaction (from the form)
# POST = sending data to create something new

@router.post("/interactions", response_model=schemas.InteractionResponse)
def create_interaction(interaction: schemas.InteractionCreate, db: Session = Depends(get_db)):
    """Save a new HCP interaction from the structured form"""
    db_interaction = models.Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

# ── GET /interactions ─────────────────────────────────────────────────────────
# Fetch all interactions
# GET = retrieving data without changing anything

@router.get("/interactions")
def get_interactions(db: Session = Depends(get_db)):
    """Get all logged interactions"""
    return db.query(models.Interaction).order_by(
        models.Interaction.created_at.desc()
    ).all()

# ── GET /interactions/{id} ────────────────────────────────────────────────────
# Fetch one specific interaction by its ID

@router.get("/interactions/{interaction_id}")
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    """Get a single interaction by ID"""
    interaction = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

# ── PUT /interactions/{id} ────────────────────────────────────────────────────
# Update an existing interaction
# PUT = replacing/updating existing data

@router.put("/interactions/{interaction_id}")
def update_interaction(
    interaction_id: int,
    update: schemas.InteractionUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing interaction"""
    interaction = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")

    # Only update fields that were actually sent (not None)
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(interaction, field, value)

    db.commit()
    db.refresh(interaction)
    return interaction

# ── POST /chat ────────────────────────────────────────────────────────────────
# This is the AI chat endpoint
# Frontend sends a message → agent processes it → returns AI response

@router.post("/chat")
def chat_with_agent(message: schemas.ChatMessage):
    """Send a message to the LangGraph AI agent"""
    result = run_agent(message.message, thread_id="session_1")
    return {
        "response": result["text"],
        "form_action": result["form_action"]
    }