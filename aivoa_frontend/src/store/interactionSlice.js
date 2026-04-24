// interactionSlice.js
// A "slice" is one piece of the Redux state
// This manages everything related to interactions

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createInteraction, getInteractions, sendChatMessage } from '../api/client'

// Async action — fetch all interactions from backend
export const fetchInteractions = createAsyncThunk(
  'interactions/fetchAll',
  async () => {
    const response = await getInteractions()
    return response.data
  }
)

// Async action — save a new interaction
export const saveInteraction = createAsyncThunk(
  'interactions/save',
  async (interactionData) => {
    const response = await createInteraction(interactionData)
    return response.data
  }
)

// Async action — send chat message to AI agent
export const sendMessage = createAsyncThunk(
  'interactions/sendMessage',
  async (message) => {
    const response = await sendChatMessage(message)
    return {
      text: response.data.response,
      form_action: response.data.form_action
    }
  }
)
const interactionSlice = createSlice({
  name: 'interactions',
  initialState: {
    list: [],           // all saved interactions
    loading: false,     // is an API call in progress?
    error: null,        // any error message
    chatMessages: [],   // chat history
    chatLoading: false, // is AI thinking?
    formData: {}, 
  },
  reducers: {
    // Add a message to chat history immediately (before API responds)
    addUserMessage: (state, action) => {
      state.chatMessages.push({
        role: 'user',
        content: action.payload
      })
    },
    clearChat: (state) => {
      state.chatMessages = []
    },
    clearFormData: (state) => {
      state.formData = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.list = action.payload
      })
      .addCase(saveInteraction.pending, (state) => {
        state.loading = true
      })
      .addCase(saveInteraction.fulfilled, (state, action) => {
        state.loading = false
        state.list.unshift(action.payload)
      })
      .addCase(saveInteraction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(sendMessage.pending, (state) => {
        state.chatLoading = true
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.chatLoading = false
        // action.payload now has { text, form_action }
        state.chatMessages.push({
          role: 'assistant',
          content: action.payload.text,
          form_action: action.payload.form_action
        })
        // If agent returned form data, update the form fields in Redux
        if (action.payload.form_action) {
          const { action: formAction, fields } = action.payload.form_action
          if (formAction === 'fill_form') {
            state.formData = { ...fields }
          } else if (formAction === 'update_form') {
            state.formData = { ...state.formData, ...fields }
          } else if (formAction === 'clear_form') {
            state.formData = { _clear: true }
          }
        }
      })
      .addCase(sendMessage.rejected, (state) => {
        state.chatLoading = false
        state.chatMessages.push({
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.'
        })
      })
  }
})

export const { addUserMessage, clearChat, clearFormData } = interactionSlice.actions
export default interactionSlice.reducer