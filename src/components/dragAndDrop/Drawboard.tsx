import React, { ReactNode, useContext, useRef, useState } from 'react'

import { BoardContext, BoardRefContext, SetBoardContext } from 'contexts/BoardContext'
import Vector2D from 'models/Vector2D'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import Vector2DUtils from 'utils/Vector2DUtils'
import { classNames } from 'utils/classNameUtils'

import './Drawboard.css'

const ZOOM_FACTOR = 1.4

export interface SelectAreaEvent {
  positionStart: Vector2D
  positionEnd: Vector2D
  shiftKey: boolean
}

export interface DrawboardProps {
  children?: ReactNode
  onSelectArea?: (event: SelectAreaEvent) => void
}

export default function Drawboard({ children, onSelectArea }: DrawboardProps) {
  const setBoard = useContext(SetBoardContext)
  const board = useContext(BoardContext)
  const boardRef = useContext(BoardRefContext)
  const elementRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const [isGrabbed, setIsGrabbed] = useState<boolean>(false)
  const [selectedArea, setSelectedArea] = useState<{ start: Vector2D; end: Vector2D }>()

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()

    switch (e.buttons) {
      case 1:
        handleLeftMouseDown(e)
        break
      case 4:
        handleMiddleMouseDown(e)
        break
    }
  }

  const handleMiddleMouseDown = (e: React.MouseEvent) => {
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

  const handleLeftMouseDown = (eDown: React.MouseEvent) => {
    if (eDown.target !== elementRef.current && eDown.target !== panelRef.current) return

    const start = Vector2DUtils.projectClientToBoard(eDown, boardRef.current)

    const handleMouseMove = (e: MouseEvent) =>
      setSelectedArea({ start: start, end: Vector2DUtils.projectClientToBoard(e, boardRef.current) })

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleMouseUp = (eUp: MouseEvent) => {
      const end = Vector2DUtils.projectClientToBoard(eUp, boardRef.current)
      onSelectArea?.({ positionStart: start, positionEnd: end, shiftKey: eUp.shiftKey })
      setSelectedArea(undefined)
      if (Vector2DUtils.equals(start, end)) (document.activeElement as HTMLElement)?.blur?.()
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
      ref={elementRef}
      style={{ '--dnd-size-factor': SIZE_FACTOR } as React.CSSProperties}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div
        className='dnd-panel'
        ref={panelRef}
        style={
          {
            translate: `${board.offset.x}px ${board.offset.y}px`,
            transform: `scale(${board.zoom})`,
            '--dnd-zoom-factor': board.zoom,
          } as React.CSSProperties
        }
      >
        {children}
        {onSelectArea !== undefined && selectedArea !== undefined && (
          <div
            className='dnd-selected-area'
            style={{
              left: Math.min(selectedArea.start.x, selectedArea.end.x),
              top: Math.min(selectedArea.start.y, selectedArea.end.y),
              width: Math.abs(selectedArea.end.x - selectedArea.start.x),
              height: Math.abs(selectedArea.end.y - selectedArea.start.y),
            }}
          />
        )}
      </div>
    </div>
  )
}
