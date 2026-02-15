import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Edge, { NewEdge } from 'models/Edge'
import NodeHandle, { NodeHandleType } from 'models/NodeHandle'

import type { RootState } from '../store'

export const selectEdgeIds = (state: RootState): string[] => state.edges.allIds

export const selectEdge =
  (id: string) =>
  (state: RootState): Edge => {
    const edge = state.edges.byId[id]
    if (edge === undefined) throw new Error(`Could not find edge with id '${id}'`)
    return edge
  }

export const selectTempEdge = (state: RootState): NewEdge | undefined => state.edges.tempEdge

export const selectIsEdgeSelected =
  (id: string) =>
  (state: RootState): boolean =>
    state.edges.selectedId == id

export const selectIsConnectedEdgeSelected =
  (handle: NodeHandle) =>
  (state: RootState): boolean =>
    (handle.type === NodeHandleType.Source ?
      (state.edges.bySource[handle.nodeId]?.[handle.key] ?? [])
    : [state.edges.byTarget[handle.nodeId]?.[handle.key]].filter(x => x !== undefined)
    ).some(x => x.id === state.edges.selectedId)

export const selectEdgesForNode =
  (nodeId: string) =>
  (state: RootState): Edge[] => {
    const edgesWithSource =
      state.edges.bySource[nodeId] !== undefined ? Object.values(state.edges.bySource[nodeId]).flat() : []
    const edgesWithTarget =
      state.edges.byTarget[nodeId] !== undefined ? Object.values(state.edges.byTarget[nodeId]) : []

    return [...edgesWithSource, ...edgesWithTarget]
  }

interface EdgesState {
  allIds: string[]
  byId: Record<string, Edge>
  bySource: Record<string, Record<string, Edge[]>>
  byTarget: Record<string, Record<string, Edge>>
  selectedId?: string
  tempEdge: NewEdge | undefined
}

const initialState: EdgesState = {
  allIds: [],
  byId: {},
  bySource: {},
  byTarget: {},
  tempEdge: undefined,
}

export const edgesSlice = createSlice({
  name: 'edges',
  initialState: initialState,
  reducers: {
    initializeEdges: (state, action: PayloadAction<Edge[]>) => {
      state.allIds = []
      state.byId = {}
      state.bySource = {}
      state.byTarget = {}
      for (const edge of action.payload) {
        state.allIds.push(edge.id)
        state.byId[edge.id] = edge
        state.bySource[edge.source.nodeId] ??= {}
        state.bySource[edge.source.nodeId]![edge.source.key] ??= []
        state.bySource[edge.source.nodeId]![edge.source.key]!.push(edge)
        state.byTarget[edge.target.nodeId] ??= {}
        state.byTarget[edge.target.nodeId]![edge.target.key] = edge
      }
    },
    removeEdges: (state, action: PayloadAction<string[]>) => {
      for (const edgeId of action.payload) {
        const edge = state.byId[edgeId]
        if (edge === undefined) return
        state.allIds = state.allIds.filter(_ => _ !== edgeId)
        delete state.byId[edgeId]

        const byTarget = state.byTarget[edge.target.nodeId]
        if (byTarget !== undefined) {
          delete byTarget[edge.target.key]
        }

        const bySource = state.bySource[edge.source.nodeId]
        if (bySource !== undefined) {
          bySource[edge.source.key] = bySource[edge.source.key]!.filter(x => x.id !== edge.id)
          if (bySource[edge.source.key]!.length == 0) {
            delete bySource[edge.source.key]
          }
        }
      }
    },
    startEdge: (state, action: PayloadAction<NewEdge>) => {
      state.tempEdge = action.payload
    },
    dropEdge: (state, action: PayloadAction<NodeHandle | undefined>) => {
      if (state.tempEdge === undefined || action.payload === undefined) {
        state.tempEdge = undefined
        return
      }

      const source = action.payload.type === NodeHandleType.Source ? action.payload : state.tempEdge.handle
      const target = action.payload.type === NodeHandleType.Source ? state.tempEdge.handle : action.payload

      if (
        source.type === target.type
        || source.nodeId === target.nodeId
        || state.byTarget[target.nodeId]?.[target.key] !== undefined
      ) {
        state.tempEdge = undefined
        return
      }

      const newEdge: Edge = {
        id: `e-${source.nodeId}.${source.key}-${target.nodeId}.${target.key}`,
        source: source,
        target: target,
      }

      state.allIds = [...state.allIds, newEdge.id]
      state.byId[newEdge.id] = newEdge
      state.bySource[newEdge.source.nodeId] ??= {}
      state.bySource[newEdge.source.nodeId]![newEdge.source.key] ??= []
      state.bySource[newEdge.source.nodeId]![newEdge.source.key]!.push(newEdge)
      state.byTarget[newEdge.target.nodeId] ??= {}
      state.byTarget[newEdge.target.nodeId]![newEdge.target.key] = newEdge
      state.tempEdge = undefined
    },
    setSelectedEdge: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload !== undefined && !(action.payload in state.byId)) return
      state.selectedId = action.payload
    },
    deleteSelectedEdge: state => {
      const id = state.selectedId
      if (id === undefined) return
      const edge = state.byId[id]
      if (edge === undefined) return
      state.allIds = state.allIds.filter(_ => _ !== id)
      delete state.byId[id]

      const byTarget = state.byTarget[edge.target.nodeId]
      if (byTarget !== undefined) {
        delete byTarget[edge.target.key]
      }

      const bySource = state.bySource[edge.source.nodeId]
      if (bySource !== undefined) {
        bySource[edge.source.key] = bySource[edge.source.key]!.filter(x => x.id !== edge.id)
        if (bySource[edge.source.key]!.length == 0) {
          delete bySource[edge.source.key]
        }
      }
    },
  },
})

export const { initializeEdges, removeEdges, startEdge, dropEdge, deleteSelectedEdge, setSelectedEdge } =
  edgesSlice.actions

export default edgesSlice.reducer
