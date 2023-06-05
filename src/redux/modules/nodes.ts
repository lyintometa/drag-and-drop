import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { RootState } from '../store'

export interface Vector2D {
  x: number
  y: number
}

export enum NodeType {
  Constant,
  Log
}

export const NODE_TYPE_OFFSET = {
  [NodeType.Constant]: { x: 256, y: [110] },
  [NodeType.Log]: { x: 0, y: [92] }
}

interface Node {
  id: string
  position: Vector2D
  type: NodeType
}

export interface NodesState {
  allIds: string[]
  byId: {
    [id: string]: Node
  }
  pickedUp: string | null
  lastMove: number
  offset: Vector2D
}

interface NodePosition {
  id: string
  position: Vector2D
}

export const selectNodeIds = (state: RootState): string[] => state.nodes.allIds
export const selectNodePosition =
  (id: string) =>
  (state: RootState): Vector2D =>
    state.nodes.byId[id].position
export const selectNodeHandlePosition =
  (id: string | undefined, handleIndex: number) =>
  (state: RootState): Vector2D => {
    if (!id) return { x: -1, y: -1 }
    const position = state.nodes.byId[id].position
    const offset = NODE_TYPE_OFFSET[state.nodes.byId[id].type]
    return { x: position.x + offset.x, y: position.y + offset.y[handleIndex] }
  }
export const selectNodePositions = (state: RootState): NodePosition[] =>
  state.nodes.allIds.map(id => ({ id, position: state.nodes.byId[id].position }))
export const selectNodeType =
  (nodeId: string) =>
  (state: RootState): NodeType =>
    state.nodes.byId[nodeId].type

const initialState: NodesState = {
  allIds: [],
  byId: {},
  pickedUp: null,
  lastMove: Date.now(),
  offset: { x: 0, y: 0 }
}

const initialStateTest: NodesState = {
  allIds: ['randomUUID()', 'awd', 'awd1'],
  byId: {
    'randomUUID()': { id: 'randomUUID()', position: { x: 0, y: 0 }, type: NodeType.Constant },
    awd: { id: 'awd', position: { x: 300, y: 200 }, type: NodeType.Constant },
    awd1: { id: 'awd1', position: { x: 800, y: 300 }, type: NodeType.Log }
  },
  pickedUp: null,
  lastMove: Date.now(),
  offset: { x: 0, y: 0 }
}

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState: initialStateTest,
  reducers: {
    addNode: (state, action: PayloadAction<Vector2D>) => {
      const position = action.payload
      const newNode: Node = {
        id: uuidv4(),
        position: {
          x: position.x - state.offset.x,
          y: position.y - state.offset.y
        },
        type: NodeType.Constant
      }
      state.allIds.push(newNode.id)
      state.byId[newNode.id] = newNode
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.allIds = state.allIds.filter(_ => _ !== id)
      delete state.byId[id]
    },
    setPosition: (state, action: PayloadAction<NodePosition>) => {
      const { id, position } = action.payload
      state.byId[id].position.x = position.x - state.offset.x
      state.byId[id].position.y = position.y - state.offset.y
    },
    pickUp: (state, action: PayloadAction<NodePosition>) => {
      const { id, position } = action.payload
      state.pickedUp = id
      state.offset.x = position.x - state.byId[id].position.x
      state.offset.y = position.y - state.byId[id].position.y
    }
  }
})

export const { addNode, removeNode, setPosition, pickUp } = nodesSlice.actions

export default nodesSlice.reducer
