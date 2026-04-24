// client.js
// All API calls to our FastAPI backend live here
// This keeps API logic separate from UI components

import axios from 'axios'

// Base URL of our FastAPI backend
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

// Save a new interaction (from the form)
export const createInteraction = (data) => API.post('/interactions', data)

// Get all interactions
export const getInteractions = () => API.get('/interactions')

// Update an interaction
export const updateInteraction = (id, data) => API.put(`/interactions/${id}`, data)

// Send a message to the AI agent
export const sendChatMessage = (message) => API.post('/chat', { message })