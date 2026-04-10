import { DetailedHTMLProps, HTMLAttributes } from 'react'

import Draggable from 'components/dragAndDrop/Draggable'
import useResizeObserver from 'hooks/useResizeObserver'
import NodeType from 'models/NodeType'
import Vector2D from 'models/Vector2D'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import {
  setPosition,
  selectNodeType,
  selectNodePosition,
  setSelectedNode,
  selectIsNodeSelected,
  toggleSelectedNode,
  setCalculatedNodeSize,
} from 'redux/modules/elements'
import { classNames } from 'utils/classNameUtils'

import AddNode from '../AddNode'
import ConstantNode from '../ConstantNode'
import GeneralNode from '../GeneralNode'
import OutNode from '../OutNode'

import './Node.css'

import NodeTemplate, { NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'

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

  if ((NODE_TEMPLATE_BY_TYPE[nodeType] as NodeTemplate).isGroup) {
    return (
      <DraggableNodeGroup id={id} nodeId={id} className='node'>
        {renderNode()}
      </DraggableNodeGroup>
    )
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

  useResizeObserver(nodeId, entry => {
    const size = entry[0]?.borderBoxSize[0]
    if (size === undefined) return
    dispatch(setCalculatedNodeSize({ id: nodeId, calculatedSize: { x: size.inlineSize, y: size.blockSize } }))
  })

  const handleMove = (position: Vector2D) => dispatch(setPosition({ id: nodeId, position: position }))

  const handleSelected = (shiftKey: boolean) =>
    shiftKey ? dispatch(toggleSelectedNode(nodeId)) : dispatch(setSelectedNode(nodeId))

  return (
    <Draggable
      className={classNames(className, { 'selected': isSelected })}
      position={position}
      onMove={handleMove}
      onSelected={handleSelected}
      {...props}
    />
  )
}

interface DraggableNode extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  nodeId: string
}

function DraggableNodeGroup({ children, className, nodeId, ...props }: DraggableNode) {
  const dispatch = useAppDispatch()
  const isSelected = useAppSelector(selectIsNodeSelected(nodeId))
  const position = useAppSelector(selectNodePosition(nodeId))

  useResizeObserver(nodeId, entry => {
    const size = entry[0]?.borderBoxSize[0]
    if (size === undefined) return
    dispatch(setCalculatedNodeSize({ id: nodeId, calculatedSize: { x: size.inlineSize, y: size.blockSize } }))
  })

  const handleMove = (position: Vector2D) => dispatch(setPosition({ id: nodeId, position: position }))

  const handleSelected = (shiftKey: boolean) =>
    shiftKey ? dispatch(toggleSelectedNode(nodeId)) : dispatch(setSelectedNode(nodeId))

  return (
    <Draggable
      className={classNames(className, 'node-group', { 'selected': isSelected })}
      position={position}
      onMove={handleMove}
      onSelected={handleSelected}
      {...props}
    >
      <div style={{ position: 'relative' }}>
        <div className='node node-group' style={{ position: 'relative', top: -15, left: -10 }}>
          <div className='node' style={{ position: 'relative', top: -15, left: -10 }}>
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  )
}
