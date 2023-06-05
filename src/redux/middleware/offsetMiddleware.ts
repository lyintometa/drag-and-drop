import { Middleware, PayloadAction } from '@reduxjs/toolkit'
import { NODE_TYPE_OFFSET, Vector2D, setPosition } from '../modules/nodes'
import { MovingEdge, moveEdge, startEdge } from '../modules/edges'
import { RootState } from '../store'

export const getOffsetMiddleware = (): Middleware<{}, RootState> => {
  const offset: Vector2D = { x: 0, y: 0 }
  return storeApi => next => (action: PayloadAction<MovingEdge> | PayloadAction<Vector2D>) => {
    switch (action.type) {
      case startEdge.type: {
        const { position, sourceNode,  ...payload } = action.payload as MovingEdge
        const nodeId = sourceNode ? sourceNode : payload.targetNode
        const node = storeApi.getState().nodes.byId[nodeId!]
        const handleIndex = payload.sourceHandle ?? payload.targetHandle

        const nodeOffset = NODE_TYPE_OFFSET[node.type]
        offset.x = position.x - node.position.x - nodeOffset.x
        offset.y = position.y - node.position.y - nodeOffset.y[handleIndex!]
        position.x = position.x - offset.x
        position.y = position.y - offset.y
        break
      }
      case moveEdge.type: {
        const position = action.payload as Vector2D
        position.x = position.x - offset.x
        position.y = position.y - offset.y
        break
      }
      default:
        break
    }

    return next(action)
  }
}
