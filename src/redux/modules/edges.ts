import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Vector2D } from './nodes'

export interface Edge {
  id: string
  sourceNode: string
  sourceHandle: number
  targetNode: string
  targetHandle: number
}

export interface MovingEdge {
  sourceNode?: string
  sourceHandle?: number
  targetNode?: string
  targetHandle?: number
  position: Vector2D
}

export interface EdgeFromSource {
  sourceNode: string
  sourceHandle: number
  position: Vector2D
}

export interface EdgeFromSource {
  sourceNode: string
  sourceHandle: number
  position: Vector2D
}

export interface NewEdge {
  sourceNode: string
  sourceHandle: number
  targetNode: string
  targetHandle: number
}

interface EdgesState {
  allIds: string[]
  byId: {
    [id: string]: Edge
  }
  tempEdgePosition: Vector2D
  offset: Vector2D
}

export const selectEdgeIds = (state: RootState): string[] => state.edges.allIds
export const selectEdges = (state: RootState): Edge[] => state.edges.allIds.map(id => state.edges.byId[id])
export const selectEdge =
  (id: string) =>
  (state: RootState): Edge =>
    state.edges.byId[id]
export const selectTempEdgePosition = (state: RootState): Vector2D | undefined => state.edges.tempEdgePosition

const initialState: EdgesState = {
  allIds: ['w'],
  byId: {
    w: {
      id: 'w',
      sourceNode: 'awd',
      sourceHandle: 0,
      targetNode: 'awd1',
      targetHandle: 0
    }
  },
  tempEdgePosition: {x: 0, y: 0},
  offset: {x: 0, y: 0}
}

export const edgesSlice = createSlice({
  name: 'edges',
  initialState: initialState,
  reducers: {
    startEdge: (state, action: PayloadAction<MovingEdge>) => {
      const { sourceNode, sourceHandle, targetNode, targetHandle, position } = action.payload
      if (!state.allIds.includes('temp')) state.allIds.push('temp')
      state.byId['temp'] = {
        id: 'temp',
        sourceNode: sourceNode ?? '',
        sourceHandle: sourceHandle ?? 0,
        targetNode: targetNode ?? '',
        targetHandle: targetHandle ?? 0
      }
      state.tempEdgePosition.x = position.x
      state.tempEdgePosition.y = position.y
    },
    moveEdge: (state, action: PayloadAction<Vector2D>) => {
      state.tempEdgePosition.x = action.payload.x //- state.offset.x
      state.tempEdgePosition.y = action.payload.y //- state.offset.y
    },
    addEdge: (state, action: PayloadAction<NewEdge>) => {
      const { sourceNode, sourceHandle, targetNode, targetHandle } = action.payload
      const newEdge: Edge = {
        id: `e-${sourceNode}-${sourceHandle}-${targetNode}-${targetHandle}`,
        ...action.payload
      }
      state.allIds.push(newEdge.id)
      state.byId[newEdge.id] = newEdge
    },
    dropEdge: state => {
      state.allIds = state.allIds.filter(_ => _ !== 'temp')
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.allIds = state.allIds.filter(_ => _ !== id)
      delete state.byId[id]
    }
  }
})

export const { startEdge, moveEdge, addEdge, dropEdge, removeEdge } = edgesSlice.actions

export default edgesSlice.reducer
