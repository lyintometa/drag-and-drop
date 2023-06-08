import { shallowEqual } from 'react-redux'
import { useAppSelector } from '../../redux/hooks'
import { selectEdge, selectTempEdgePosition } from '../../redux/modules/edges'
import { selectNodeHandlePosition } from '../../redux/modules/nodes'


const paddingY = 5
const controlPointOffset = 100
const marginX = 10

export interface EdgeProps {
  id: string
}

function Edge({ id }: EdgeProps) {
  const edge = useAppSelector(selectEdge(id))
  const sourcePosi = useAppSelector(selectNodeHandlePosition(edge.sourceNode, edge.sourceHandle), shallowEqual)
  const targetPosi = useAppSelector(selectNodeHandlePosition(edge.targetNode, edge.targetHandle), shallowEqual)
  const tempEdgePos = useAppSelector(selectTempEdgePosition, (a, b) => id !== 'temp' || shallowEqual(a, b))

  const sourcePos = sourcePosi.x !== -1 ? sourcePosi : tempEdgePos!
  const targetPos = targetPosi.x !== -1 ? targetPosi : tempEdgePos!

  const sourceLeft = sourcePos.x <= targetPos.x
  const sourceTop = sourcePos.y <= targetPos.y
  const width = Math.abs(sourcePos.x - targetPos.x)
  const paddingX = sourceLeft ? 40 : 40 + width * 0.04
  const height = Math.abs(sourcePos.y - targetPos.y)
  const controlPointOffsetActual = Math.max(controlPointOffset, width / 3)

  const x0 = sourceLeft ? paddingX + marginX : paddingX + marginX + width
  const x1 = x0 + controlPointOffsetActual
  const x3 = sourceLeft ? paddingX - marginX + width : paddingX - marginX
  const x2 = x3 - controlPointOffsetActual

  const y0 = sourceTop ? paddingY : paddingY + height
  const y3 = sourceTop ? paddingY + height : paddingY

  const left = (sourceLeft ? sourcePos.x : targetPos.x) - paddingX
  const top = (sourceTop ? sourcePos.y : targetPos.y) - paddingY

  const d = ['M', x0, y0, 'C', x1, y0, x2, y3, x3, y3].join(' ')

  return (
    <svg
      width={width + paddingX * 2}
      height={height + paddingY * 2}
      style={{
        position: 'absolute',
        top: top,
        left: left,
        //border: '1px solid black'
      }}
    >
      <path d={d} stroke='grey' strokeWidth='1' fill='none' strokeLinecap='round' strokeDasharray='10,10' />
    </svg>
  )
}

export default Edge
