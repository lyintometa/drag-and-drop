import { Middleware } from '@reduxjs/toolkit'
import { setPosition } from '../modules/nodes'
import { moveEdge } from '../modules/edges'

interface RerenderMiddlewarParams {
  framesPerSecond: number
}

export const getRerenderMiddleware = (params: RerenderMiddlewarParams = { framesPerSecond: 60 }): Middleware => {
  const prevRender = { timeStamp: 0 }
  return storeApi => next => action => {
    if (action.type !== setPosition.type && action.type !== moveEdge.type) return next(action)
    const now = Date.now()
    if (prevRender.timeStamp + 1000 / params.framesPerSecond > now) return
    // const { id, position } = action.payload
    // const prevPosition = storeApi.getState().nodes.byId[id].position
    // const offset = storeApi.getState().nodes.offset
    // if (prevPosition.x === position.x - offset.x && prevPosition.y === position.y - offset.y) return
    prevRender.timeStamp = now
    return next(action)
  }
}
