import React, { Dispatch, SetStateAction } from 'react'

import Vector2D from 'models/Vector2D'

export interface BoardState {
  offset: Vector2D
  zoom: number
}

export const BoardContext = React.createContext<BoardState>({ offset: { x: 0, y: 0 }, zoom: 1 })

export const BoardRefContext = React.createContext<React.RefObject<BoardState>>({
  current: { offset: { x: 0, y: 0 }, zoom: 1 },
})

export const SetBoardContext = React.createContext<Dispatch<SetStateAction<BoardState>>>(() => {
  throw new Error('SetBoardContext used outside BoardContextProvider')
})

export const ZoomContext = React.createContext<number>(1)
