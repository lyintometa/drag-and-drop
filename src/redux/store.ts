import { combineReducers, configureStore } from '@reduxjs/toolkit'

import elementsReducer from './modules/elements'

const rootReducer = combineReducers({
  elements: elementsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
