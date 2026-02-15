import { DetailedHTMLProps, HTMLAttributes, useState, useContext } from 'react'

import { BoardRefContext } from 'contexts/BoardContext'
import Vector2D from 'models/Vector2D'
import Vector2DUtils from 'utils/Vector2DUtils'
import { classNames } from 'utils/classNameUtils'

import './Draggable.css'

export interface DraggableProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  position: Vector2D
  onMove: (position: Vector2D) => void
}

export default function Draggable({ className, position, style, onMouseDown, onMove, ...props }: DraggableProps) {
  const boardRef = useContext(BoardRefContext)

  const [isGrabbed, setIsGrabbed] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()

    const grabOffset = Vector2DUtils.subtract(Vector2DUtils.projectClientToBoard(e, boardRef.current), position)

    const handleMouseMove = (e: MouseEvent) => {
      setIsGrabbed(true)
      onMove(Vector2DUtils.subtract(Vector2DUtils.projectClientToBoard(e, boardRef.current), grabOffset))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleMouseUp = () => {
      setIsGrabbed(false)
      window.removeEventListener('mousemove', handleMouseMove)
    }

    window.addEventListener('mouseup', handleMouseUp, { once: true, passive: true })

    onMouseDown?.(e)
  }

  return (
    <div
      className={classNames(className, 'dnd-draggable', { 'dnd-grabbed': isGrabbed })}
      style={{ ...style, left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      {...props}
    />
  )
}
