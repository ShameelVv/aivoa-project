// store.js
// Redux store — the single source of truth for our app's state
// Think of it as a global variable that ALL components can read and update

import { configureStore } from '@reduxjs/toolkit'
import interactionReducer from './interactionSlice'

export const store = configureStore({
  reducer: {
    interactions: interactionReducer,
  },
})