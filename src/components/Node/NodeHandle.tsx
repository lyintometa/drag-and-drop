import { useRef } from 'react'
import { Button, SxProps } from '@mui/material'
import { useAppDispatch } from '../../redux/hooks'
import { dropEdge, moveEdge, startEdge } from '../../redux/modules/edges'

export interface NodeHandleProps {
  nodeId: string
  index: number
  type: 'source' | 'target'
  sx?: SxProps
}

function NodeHandle({ nodeId, index, type, sx }: NodeHandleProps) {
  const dispatch = useAppDispatch()
  const dummyRef = useRef<HTMLDivElement>(null)
  const side = type === 'source' ? { right: '-7px' } : { left: '-7px' }

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.dataTransfer.setDragImage(dummyRef.current!, 0, 0)
    const newEdge =
      type === 'source' ? { sourceNode: nodeId, sourceHandle: index } : { targetNode: nodeId, targetHandle: index }
    dispatch(startEdge({ ...newEdge, position: { x: e.clientX, y: e.clientY } }))
  }

  const handleDrag = (e: React.DragEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    dispatch(moveEdge({ x: e.clientX, y: e.clientY }))
  }

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    dispatch(dropEdge())
  }

  return (
    <>
      <div ref={dummyRef} />
      <Button
        sx={{
          margin: 'auto',
          backgroundColor: 'lightgrey',
          minWidth: 0,
          padding: 0,
          height: '14px',
          width: '14px',
          borderRadius: '7px',
          position: 'absolute',
          ...side,
          '&:hover': {
            backgroundColor: 'grey'
          },
          ...sx
        }}
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />
    </>
  )
}

export default NodeHandle
