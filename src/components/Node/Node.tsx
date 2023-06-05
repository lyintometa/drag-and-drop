import React, { useMemo } from 'react'
import { selectNodePosition, pickUp, setPosition, selectNodeType, NodeType } from '../../redux/modules/nodes'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import ConstantNode from './ConstantNode'
import Card from '@mui/material/Card'
import LogNode from './LogNode'

interface NodeProps {
  id: string
}

function Node({ id }: NodeProps) {
  const dispatch = useAppDispatch()
  const position = useAppSelector(selectNodePosition(id))
  const nodeType = useAppSelector(selectNodeType(id))

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) =>
    dispatch(pickUp({ id, position: { x: e.clientX, y: e.clientY } }))

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) =>
    dispatch(setPosition({ id, position: { x: e.clientX, y: e.clientY } }))

  const renderNode = () => {
    switch (nodeType) {
      case NodeType.Constant:
        return <ConstantNode id={id} />
      case NodeType.Log:
        return <LogNode id={id} />
    }
  }

  return (
    <div style={{ position: 'absolute', top: position.y, left: position.x }}>
      {useMemo(
        () => (
          <Card
            sx={{
              backgroundColor: 'white',
              border: '1px solid lightgrey',
              overflow: 'visible'
            }}
            draggable
            onDragStart={handleDragStart}
            onDrag={handleDrag}
          >
            {renderNode()}
          </Card>
        ),
        []
      )}
    </div>
  )
}

export default Node
