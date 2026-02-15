import Curve from 'components/dragAndDrop/Curve'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectEdge, selectIsEdgeSelected, setSelectedEdge } from 'redux/modules/edges'
import { selectNodeHandlePosition, setSelectedNode } from 'redux/modules/nodes'
import Vector2DUtils from 'utils/Vector2DUtils'

export interface EdgeProps {
  edgeId: string
}

export default function Edge({ edgeId }: EdgeProps) {
  const dispatch = useAppDispatch()
  const edge = useAppSelector(selectEdge(edgeId))
  const isSelected = useAppSelector(selectIsEdgeSelected(edgeId))
  const sourcePosition = useAppSelector(selectNodeHandlePosition(edge.source), Vector2DUtils.equals)
  const targetPosition = useAppSelector(selectNodeHandlePosition(edge.target), Vector2DUtils.equals)

  if (sourcePosition === undefined || targetPosition === undefined) return null

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(setSelectedEdge(edgeId))
    dispatch(setSelectedNode(undefined))
  }

  return (
    <Curve
      id={edgeId}
      isSelected={isSelected}
      positionStart={sourcePosition}
      positionEnd={targetPosition}
      onClick={handleClick}
    />
  )
}
