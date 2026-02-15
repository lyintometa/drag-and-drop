import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Node from 'models/Node'
import NodeHandle from 'models/NodeHandle'
import NodeType from 'models/NodeType'
import Vector2D from 'models/Vector2D'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import Vector2DUtils from 'utils/Vector2DUtils'
import { v4 as uuidv4 } from 'uuid'

import type { RootState } from '../store'

export const selectNodeIds = (state: RootState): string[] => state.nodes.allIds

export const selectNodePosition =
  (id: string) =>
  (state: RootState): Vector2D => {
    const node = state.nodes.byId[id]
    if (node === undefined) throw new Error(`Node '${id}' not found`)
    return node.position
  }

export const selectNodeHandlePosition =
  (handleId: Pick<NodeHandle, 'nodeId' | 'key'>) =>
  (state: RootState): Vector2D | undefined => {
    const node = state.nodes.byId[handleId.nodeId]
    if (node === undefined) throw new Error(`Node '${handleId.nodeId}' not found`)
    const handle = node.handles[handleId.key]
    if (handle === undefined) return undefined
    return Vector2DUtils.add(node.position, handle)
  }

export const selectNodeType =
  (id: string) =>
  (state: RootState): NodeType => {
    const node = state.nodes.byId[id]
    if (node === undefined) throw new Error(`Node '${id}' not found`)
    return node.type
  }

export const selectNodeValue =
  <TValue>(id: string) =>
  (state: RootState): TValue => {
    const node = state.nodes.byId[id]
    if (node === undefined) throw new Error(`Node '${id}' not found`)
    return node.value as TValue
  }

export const selectIsNodeSelected =
  (id: string) =>
  (state: RootState): boolean =>
    state.nodes.selectedId == id

export const selectGrabbedHandle = (state: RootState) => state.nodes.grabbedHandle

export const selectIsHandleGrabbed = (handle: NodeHandle) => (state: RootState) =>
  state.nodes.grabbedHandle?.nodeId === handle.nodeId && state.nodes.grabbedHandle.key === handle.key

interface NodesState {
  allIds: string[]
  byId: Record<string, Node>
  selectedId?: string
  grabbedHandle?: NodeHandle
}

const initialState: NodesState = {
  allIds: [],
  byId: {},
}

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState: initialState,
  reducers: {
    initializeNodes: (state, action: PayloadAction<Node[]>) => {
      state.allIds = []
      state.byId = {}
      for (const node of action.payload) {
        state.allIds.push(node.id)
        state.byId[node.id] = { ...node, position: Vector2DUtils.multiply(node.position, SIZE_FACTOR) }
      }
    },
    addNode: (state, action: PayloadAction<Vector2D>) => {
      const position = action.payload
      const newNode: Node = {
        id: uuidv4(),
        position: position,
        type: NodeType.Constant,
        handles: {},
        value: {},
      }
      state.allIds.push(newNode.id)
      state.byId[newNode.id] = newNode
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.allIds = state.allIds.filter(_ => _ !== id)
      delete state.byId[id]
    },
    setPosition: (state, action: PayloadAction<{ id: string; position: Vector2D }>) => {
      const { id, position } = action.payload
      const node = state.byId[id]
      if (node === undefined) throw new Error(`Node '${id}' not found`)
      node.position.x = Math.round(position.x)
      node.position.y = Math.round(position.y)
    },
    offsetPosition: (state, action: PayloadAction<{ id: string; offset: Vector2D }>) => {
      const { id, offset } = action.payload
      const node = state.byId[id]
      if (node === undefined) throw new Error(`Node '${id}' not found`)
      node.position.x = node.position.x + offset.x * SIZE_FACTOR * 10
      node.position.y = node.position.y + offset.y * SIZE_FACTOR * 10
    },
    setHandlePosition: (state, action: PayloadAction<{ handle: NodeHandle; position: Vector2D }>) => {
      const { handle, position } = action.payload
      const node = state.byId[handle.nodeId]
      if (node === undefined) throw new Error(`Node '${handle.nodeId}' not found`)
      node.handles[handle.key] = position
    },
    setNodeValue: (state, action: PayloadAction<{ id: string; value: unknown }>) => {
      const { id, value } = action.payload
      const node = state.byId[id]
      if (node === undefined) throw new Error(`Node '${id}' not found`)
      node.value = value
    },
    setSelectedNode: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload !== undefined && !(action.payload in state.byId)) return
      state.selectedId = action.payload
    },
    deleteSelectedNode: state => {
      const id = state.selectedId
      if (id === undefined) return
      const node = state.byId[id]
      if (node === undefined) return
      state.allIds = state.allIds.filter(_ => _ !== id)
      delete state.byId[id]
    },
    setGrabbedHandle: (state, action: PayloadAction<NodeHandle | undefined>) => {
      state.grabbedHandle = action.payload
    },
  },
})

export const {
  initializeNodes,
  addNode,
  removeNode,
  setPosition,
  offsetPosition,
  setHandlePosition,
  setNodeValue,
  setSelectedNode,
  deleteSelectedNode,
  setGrabbedHandle,
} = nodesSlice.actions

export default nodesSlice.reducer
