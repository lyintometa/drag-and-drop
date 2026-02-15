import { ReactNode, useEffect, useRef, useState } from 'react'

import { BoardContext, BoardRefContext, BoardState, SetBoardContext, ZoomContext } from 'contexts/BoardContext'

export interface BoardProviderProps {
  children?: ReactNode
}

export const SIZE_FACTOR = 4

export default function BoardProvider({ children }: BoardProviderProps) {
  const [board, setBoard] = useState<BoardState>({
    offset: { x: 0, y: 0 },
    zoom: 1 / SIZE_FACTOR,
  })

  const boardRef = useRef<BoardState>(board)

  useEffect(() => {
    boardRef.current = board
  }, [board])

  return (
    <SetBoardContext value={setBoard}>
      <BoardRefContext value={boardRef}>
        <ZoomContext value={board.zoom}>
          <BoardContext value={board}>{children}</BoardContext>
        </ZoomContext>
      </BoardRefContext>
    </SetBoardContext>
  )
}
