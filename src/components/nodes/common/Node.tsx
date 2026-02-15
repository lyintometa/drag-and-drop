import { DetailedHTMLProps, HTMLAttributes, useCallback } from 'react'

import Draggable from 'components/dragAndDrop/Draggable'
import useWindowEventListener from 'hooks/useWindowEventListener'
import NodeType from 'models/NodeType'
import Vector2D from 'models/Vector2D'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setSelectedEdge } from 'redux/modules/edges'
import {
  setPosition,
  selectNodeType,
  selectNodePosition,
  setSelectedNode,
  selectIsNodeSelected,
  offsetPosition,
} from 'redux/modules/nodes'
import MousePositionUtils from 'utils/MousePositionUtils'
import { classNames } from 'utils/classNameUtils'

import AddNode from '../AddNode'
import ConstantNode from '../ConstantNode'
import GeneralNode from '../GeneralNode'
import OutNode from '../OutNode'
import './Node.css'

export interface NodeProps {
  id: string
}

export default function Node({ id }: NodeProps) {
  const nodeType = useAppSelector(selectNodeType(id))

  const renderNode = () => {
    switch (nodeType) {
      case NodeType.Add:
        return <AddNode id={id} />
      case NodeType.Constant:
        return <ConstantNode id={id} />
      case NodeType.Out:
        return <OutNode id={id} />
      default:
        return <GeneralNode id={id} type={nodeType} />
    }
  }

  return (
    <DraggableNode id={id} nodeId={id} className='node'>
      {renderNode()}
    </DraggableNode>
  )
}

interface DraggableNode extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  nodeId: string
}

function DraggableNode({ className, nodeId, ...props }: DraggableNode) {
  const dispatch = useAppDispatch()
  const isSelected = useAppSelector(selectIsNodeSelected(nodeId))

  const position = useAppSelector(selectNodePosition(nodeId))

  function handleMouseDown(downEvent: React.MouseEvent) {
    window.addEventListener(
      'mouseup',
      upEvent => {
        if (!MousePositionUtils.equals(downEvent, upEvent)) return
        dispatch(setSelectedNode(nodeId))
        dispatch(setSelectedEdge(undefined))
      },
      { once: true, passive: true },
    )
  }

  const handleMove = useCallback(
    (position: Vector2D) => dispatch(setPosition({ id: nodeId, position: position })),
    [nodeId, dispatch],
  )

  useWindowEventListener('keydown', (e: KeyboardEvent) => {
    if (!isSelected) return
    switch (e.key) {
      case 'ArrowLeft':
        dispatch(offsetPosition({ id: nodeId, offset: { x: -1, y: 0 } }))
        break
      case 'ArrowRight':
        dispatch(offsetPosition({ id: nodeId, offset: { x: 1, y: 0 } }))
        break
      case 'ArrowUp':
        dispatch(offsetPosition({ id: nodeId, offset: { x: 0, y: -1 } }))
        break
      case 'ArrowDown':
        dispatch(offsetPosition({ id: nodeId, offset: { x: 0, y: 1 } }))
        break
    }
  })

  return (
    <Draggable
      className={classNames(className, { selected: isSelected })}
      onMouseDown={handleMouseDown}
      position={position}
      onMove={handleMove}
      {...props}
    />
  )
}
