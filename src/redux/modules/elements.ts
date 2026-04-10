import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Edge, { NewEdge } from 'models/Edge'
import Node from 'models/Node'
import NodeHandle, { NodeHandleType } from 'models/NodeHandle'
import NodeType from 'models/NodeType'
import Vector2D from 'models/Vector2D'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import ArrayUtils from 'utils/ArrayUtils'
import Vector2DUtils from 'utils/Vector2DUtils'
import { v4 as uuidv4 } from 'uuid'

import type { RootState } from '../store'

export const selectNodeIds = (state: RootState): string[] => state.elements.nodes.allIds

export const selectNodePosition =
  (id: string) =>
  (state: RootState): Vector2D =>
    getNode(state.elements, id).position

export const selectNodeHandlePosition =
  (handleId: NodeHandle) =>
  (state: RootState): Vector2D | undefined => {
    const node = getNode(state.elements, handleId.nodeId)
    const handle = getHandleOfNode(node, handleId.key)
    if (handle.position === undefined) return undefined
    return Vector2DUtils.add(node.position, handle.position)
  }

export const selectNodeType =
  (id: string) =>
  (state: RootState): NodeType =>
    getNode(state.elements, id).type

export const selectNodeValue =
  <TValue>(id: string) =>
  (state: RootState): TValue =>
    getNode(state.elements, id).value as TValue

export const selectIsNodeSelected =
  (id: string) =>
  (state: RootState): boolean =>
    state.elements.nodes.selectedIds.includes(id)

export const selectGrabbedHandle = (state: RootState) => state.elements.nodes.grabbedHandle

export const selectIsHandleGrabbed = (handle: NodeHandle) => (state: RootState) =>
  state.elements.nodes.grabbedHandle?.nodeId === handle.nodeId && state.elements.nodes.grabbedHandle.key === handle.key

export const selectEdgeIds = (state: RootState): string[] => state.elements.edges.allIds

export const selectEdge =
  (id: string) =>
  (state: RootState): Edge =>
    getEdge(state.elements, id)

export const selectTempEdge = (state: RootState): NewEdge | undefined => state.elements.edges.tempEdge

export const selectIsEdgeSelected =
  (id: string) =>
  (state: RootState): boolean => {
    if (state.elements.edges.selectedIds.includes(id)) return true
    const edge = getEdge(state.elements, id)

    const sourceNode = getNode(state.elements, edge.source.nodeId)
    const targetNode = getNode(state.elements, edge.target.nodeId)

    return (
      state.elements.nodes.selectedIds.includes(sourceNode.id)
      && state.elements.nodes.selectedIds.includes(targetNode.id)
    )
  }

export const selectIsConnectedEdgeSelected =
  (handle: NodeHandle) =>
  (state: RootState): boolean =>
    Object.values(state.elements.edges.byId).some(edge => {
      const matchesHandle =
        handle.type === NodeHandleType.Source ?
          edge.source.nodeId === handle.nodeId && edge.source.key === handle.key
        : edge.target.nodeId === handle.nodeId && edge.target.key === handle.key
      return matchesHandle && state.elements.edges.selectedIds.includes(edge.id)
    })

interface NodeHandleState {
  connectedEdges: string[]
  position?: Vector2D
}

export interface NodeState extends Omit<Node, 'handles'> {
  handles: Record<string, NodeHandleState>
  calculatedSize?: Vector2D
}

interface ElementsState {
  nodes: {
    allIds: string[]
    byId: Record<string, NodeState>
    selectedIds: string[]
    grabbedHandle?: NodeHandle
  }
  edges: {
    allIds: string[]
    byId: Record<string, Edge>
    selectedIds: string[]
    tempEdge: NewEdge | undefined
  }
}

const initialState: ElementsState = {
  nodes: {
    allIds: [],
    byId: {},
    selectedIds: [],
  },
  edges: {
    allIds: [],
    byId: {},
    selectedIds: [],
    tempEdge: undefined,
  },
}

export const elementsSlice = createSlice({
  name: 'elements',
  initialState: initialState,
  reducers: {
    initialize: (state, action: PayloadAction<{ nodes: Node[]; edges: Edge[] }>) => {
      const { nodes, edges } = action.payload

      state.nodes.allIds = []
      state.nodes.byId = {}
      state.edges.allIds = []
      state.edges.byId = {}

      for (const node of nodes) {
        state.nodes.allIds.push(node.id)
        state.nodes.byId[node.id] = {
          ...node,
          position: Vector2DUtils.multiply(node.position, SIZE_FACTOR),
          handles: Object.fromEntries(Object.keys(node.handles).map(key => [key, { connectedEdges: [] }])),
        }
      }

      for (const edge of edges) {
        state.edges.allIds.push(edge.id)
        state.edges.byId[edge.id] = edge

        getHandle(state, edge.source).connectedEdges.push(edge.id)
        getHandle(state, edge.target).connectedEdges.push(edge.id)
      }
    },
    addNode: (state, action: PayloadAction<{ type: NodeType; position: Vector2D }>) => {
      const { type, position } = action.payload
      const newNode: NodeState = {
        id: uuidv4(),
        position: position,
        type: type,
        handles: {},
        value: {},
      }
      state.nodes.allIds.push(newNode.id)
      state.nodes.byId[newNode.id] = newNode
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload
      state.nodes.allIds = state.nodes.allIds.filter(id => id !== nodeId)
      delete state.nodes.byId[nodeId]
    },
    setPosition: (state, action: PayloadAction<{ id: string; position: Vector2D }>) => {
      const { id, position } = action.payload
      const node = getNode(state, id)
      const delta = Vector2DUtils.round(Vector2DUtils.subtract(position, node.position))
      if (state.nodes.selectedIds.includes(id)) {
        for (const selectedId of state.nodes.selectedIds) {
          const selectedNode = getNode(state, selectedId)
          selectedNode.position = Vector2DUtils.round(Vector2DUtils.add(selectedNode.position, delta))
        }
      } else {
        node.position = Vector2DUtils.round(position)
      }
    },
    offsetSelectedPosition: (state, action: PayloadAction<Vector2D>) => {
      const delta = Vector2DUtils.multiply(action.payload, SIZE_FACTOR * 10)
      for (const selectedId of state.nodes.selectedIds) {
        const selectedNode = getNode(state, selectedId)
        selectedNode.position = Vector2DUtils.round(Vector2DUtils.add(selectedNode.position, delta))
      }
    },
    setCalculatedNodeSize: (state, action: PayloadAction<{ id: string; calculatedSize: Vector2D }>) => {
      const { id, calculatedSize } = action.payload
      getNode(state, id).calculatedSize = calculatedSize
    },
    setHandlePosition: (state, action: PayloadAction<{ handle: NodeHandle; position: Vector2D }>) => {
      const { nodeId, key } = action.payload.handle
      const node = getNode(state, nodeId)
      const nodeHandle = node.handles[key]
      if (nodeHandle === undefined) {
        node.handles[key] = { connectedEdges: [], position: action.payload.position }
      } else {
        nodeHandle.position = action.payload.position
      }
    },
    setNodeValue: (state, action: PayloadAction<{ id: string; value: unknown }>) => {
      const { id, value } = action.payload
      getNode(state, id).value = value
    },
    startEdge: (state, action: PayloadAction<NewEdge>) => {
      state.edges.tempEdge = action.payload
      state.nodes.grabbedHandle = action.payload.handle
    },
    dropEdge: (state, action: PayloadAction<NodeHandle | undefined>) => {
      if (state.edges.tempEdge === undefined || action.payload === undefined) {
        state.edges.tempEdge = undefined
        state.nodes.grabbedHandle = undefined
        return
      }

      const source = action.payload.type === NodeHandleType.Source ? action.payload : state.edges.tempEdge.handle
      const target = action.payload.type === NodeHandleType.Source ? state.edges.tempEdge.handle : action.payload

      const sourceHandle = getHandle(state, source)
      const targetHandle = getHandle(state, target)
      if (sourceHandle === undefined || targetHandle === undefined) {
        state.edges.tempEdge = undefined
        state.nodes.grabbedHandle = undefined
        return
      }

      if (source.type === target.type || source.nodeId === target.nodeId || targetHandle.connectedEdges.length > 0) {
        state.edges.tempEdge = undefined
        state.nodes.grabbedHandle = undefined
        return
      }

      const newEdge: Edge = {
        id: `e-${source.nodeId}.${source.key}-${target.nodeId}.${target.key}`,
        source: source,
        target: target,
      }

      state.edges.allIds = [...state.edges.allIds, newEdge.id]
      state.edges.byId[newEdge.id] = newEdge
      sourceHandle.connectedEdges.push(newEdge.id)
      targetHandle.connectedEdges.push(newEdge.id)

      state.edges.tempEdge = undefined
      state.nodes.grabbedHandle = undefined
    },
    setSelectedNode: (state, action: PayloadAction<string>) => {
      state.nodes.selectedIds = [action.payload]
      state.edges.selectedIds = []
    },
    setSelectedEdge: (state, action: PayloadAction<string>) => {
      state.edges.selectedIds = [action.payload]
      state.nodes.selectedIds = []
    },
    toggleSelectedNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload
      const selectedIds = state.nodes.selectedIds
      state.nodes.selectedIds =
        selectedIds.includes(nodeId) ? selectedIds.filter(id => id !== nodeId) : [...selectedIds, nodeId]
    },
    toggleSelectedEdge: (state, action: PayloadAction<string>) => {
      const edgeId = action.payload
      const selectedIds = state.edges.selectedIds
      state.edges.selectedIds =
        selectedIds.includes(edgeId) ? selectedIds.filter(id => id !== edgeId) : [...selectedIds, edgeId]
    },
    selectArea: (state, action: PayloadAction<{ start: Vector2D; end: Vector2D; shiftKey: boolean }>) => {
      const { start, end, shiftKey } = action.payload
      const minX = Math.min(start.x, end.x)
      const maxX = Math.max(start.x, end.x)
      const minY = Math.min(start.y, end.y)
      const maxY = Math.max(start.y, end.y)

      const nodes = Object.values(state.nodes.byId)
      const nodesInArea = nodes
        .filter(
          ({ position, calculatedSize }) =>
            position.x + (calculatedSize?.x ?? 0) >= minX
            && position.x <= maxX
            && position.y + (calculatedSize?.y ?? 0) >= minY
            && position.y <= maxY,
        )
        .map(n => n.id)

      state.nodes.selectedIds = shiftKey ? ArrayUtils.union(state.nodes.selectedIds, nodesInArea) : nodesInArea
      state.edges.selectedIds = []
    },
    clearSelected: state => {
      state.edges.selectedIds = []
      state.nodes.selectedIds = []
    },
    deleteSelected: state => {
      const nodeIdsToDelete: string[] = []

      for (const nodeId of state.nodes.selectedIds) {
        const node = getNode(state, nodeId)
        if (node.type === NodeType.Out) {
          continue
        }

        nodeIdsToDelete.push(nodeId)
        delete state.nodes.byId[nodeId]

        for (const edgeId of Object.values(node.handles).flatMap(handle => handle.connectedEdges)) {
          state.edges.selectedIds.push(edgeId)
        }
      }

      for (const edgeId of state.edges.selectedIds) {
        const edge = state.edges.byId[edgeId]
        if (edge === undefined) continue // Already deleted
        delete state.edges.byId[edgeId]

        const sourceNode = state.nodes.byId[edge.source.nodeId]
        if (sourceNode !== undefined) {
          const sourceHandle = getHandleOfNode(sourceNode, edge.source.key)
          sourceHandle.connectedEdges = sourceHandle.connectedEdges.filter(id => id !== edgeId)
        } // else { /* Already deleted */ }

        const targetNode = state.nodes.byId[edge.target.nodeId]
        if (targetNode !== undefined) {
          const targetHandle = getHandleOfNode(targetNode, edge.target.key)
          targetHandle.connectedEdges = targetHandle.connectedEdges.filter(id => id !== edgeId)
        } // else { /* Already deleted */ }
      }

      state.nodes.allIds = ArrayUtils.difference(state.nodes.allIds, nodeIdsToDelete)
      state.edges.allIds = ArrayUtils.difference(state.edges.allIds, state.edges.selectedIds)
      state.nodes.selectedIds = state.nodes.selectedIds.filter(id => !nodeIdsToDelete.includes(id))
      state.edges.selectedIds = []
    },
  },
})

export const {
  initialize,
  addNode,
  removeNode,
  setPosition,
  offsetSelectedPosition,
  setCalculatedNodeSize,
  setHandlePosition,
  setNodeValue,
  startEdge,
  dropEdge,
  setSelectedNode,
  setSelectedEdge,
  toggleSelectedNode,
  toggleSelectedEdge,
  selectArea,
  clearSelected,
  deleteSelected,
} = elementsSlice.actions

export default elementsSlice.reducer

const getNode = (state: ElementsState, nodeId: string): NodeState => {
  const node = state.nodes.byId[nodeId]
  if (node === undefined) throw new Error(`Node '${nodeId}' not found`)
  return node
}

const getHandle = (state: ElementsState, handle: NodeHandle): NodeHandleState => {
  const node = state.nodes.byId[handle.nodeId]
  if (node === undefined) throw new Error(`Node '${handle.nodeId}' not found`)
  const nodeHandle = node.handles[handle.key]
  if (nodeHandle === undefined) throw new Error(`Handle '${handle.key}' not found on node '${handle.nodeId}'`)
  return nodeHandle
}

const getHandleOfNode = (node: NodeState, handleKey: string): NodeHandleState => {
  const nodeHandle = node.handles[handleKey]
  if (nodeHandle === undefined) throw new Error(`Handle '${handleKey}' not found on node '${node.id}'`)
  return nodeHandle
}

const getEdge = (state: ElementsState, edgeId: string): Edge => {
  const edge = state.edges.byId[edgeId]
  if (edge === undefined) throw new Error(`Edge '${edgeId}' not found`)
  return edge
}
