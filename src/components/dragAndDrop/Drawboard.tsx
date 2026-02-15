import React, { ReactNode, useContext, useState } from 'react'

import { BoardContext, SetBoardContext } from 'contexts/BoardContext'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import Vector2DUtils from 'utils/Vector2DUtils'
import { classNames } from 'utils/classNameUtils'

import './Drawboard.css'

const ZOOM_FACTOR = 1.4

export interface DrawboardProps {
  children?: ReactNode
}

export default function Drawboard({ children }: DrawboardProps) {
  const setBoard = useContext(SetBoardContext)
  const board = useContext(BoardContext)

  const [isGrabbed, setIsGrabbed] = useState<boolean>(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.buttons !== 1 && e.buttons !== 2 && e.buttons !== 4) return

    const grabOffset = Vector2DUtils.subtract({ x: e.clientX, y: e.clientY }, board.offset)

    const handleMouseMove = (e: MouseEvent) => {
      setIsGrabbed(true)
      setBoard(prev => ({ ...prev, offset: Vector2DUtils.subtract({ x: e.clientX, y: e.clientY }, grabOffset) }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleMouseUp = () => {
      setIsGrabbed(false)
      window.removeEventListener('mousemove', handleMouseMove)
    }

    window.addEventListener('mouseup', handleMouseUp, { once: true, passive: true })
  }

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR
    setBoard(prev => ({
      offset: {
        x: zoomFactor * prev.offset.x + (1 - zoomFactor) * (e.clientX - 0.5 * window.innerWidth),
        y: zoomFactor * prev.offset.y + (1 - zoomFactor) * (e.clientY - 0.5 * window.innerHeight),
      },
      zoom: prev.zoom * zoomFactor,
    }))
  }

  return (
    <div
      className={classNames('dnd-drawboard', { 'dnd-grabbed': isGrabbed })}
      style={{ '--dnd-size-factor': SIZE_FACTOR } as React.CSSProperties}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div
        className='dnd-panel'
        style={{ translate: `${board.offset.x}px ${board.offset.y}px`, transform: `scale(${board.zoom})` }}
      >
        {children}
      </div>
    </div>
  )
}
