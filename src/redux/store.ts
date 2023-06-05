import { combineReducers, configureStore } from '@reduxjs/toolkit'
import edgesReducer from './modules/edges'
import nodesReducer from './modules/nodes'
import constantNodesReducer from './modules/constantNodes'
import { getRerenderMiddleware } from './middleware/rerenderMiddleware'
import { getOffsetMiddleware } from './middleware/offsetMiddleware'

const rootReducer = combineReducers({
  edges: edgesReducer,
  nodes: nodesReducer,
  constantNodes: constantNodesReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(getRerenderMiddleware({ framesPerSecond: 144 }))
      .concat(getOffsetMiddleware())
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
