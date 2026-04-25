# main.py
# This is where the FastAPI app starts
# It's like the front door of the entire backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routes.interactions import router

# Create all DB tables automatically based on models.py
# If tables already exist, it skips them safely
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIVOA HCP CRM API")

# ── CORS Middleware ───────────────────────────────────────────────────────────
# CORS = Cross Origin Resource Sharing
# Without this, the browser BLOCKS the frontend from talking to the backend
# because they run on different ports (React: 5173, FastAPI: 8000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our routes under /api prefix
# So endpoints will be: /api/interactions, /api/chat
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AIVOA HCP CRM API is running!"}