import { useContext, useState } from 'react'

import Curve from 'components/dragAndDrop/Curve'
import { BoardRefContext } from 'contexts/BoardContext'
import useWindowEventListener from 'hooks/useWindowEventListener'
import NodeHandle, { NodeHandleType } from 'models/NodeHandle'
import Vector2D from 'models/Vector2D'
import { useAppSelector } from 'redux/hooks'
import { selectTempEdge } from 'redux/modules/edges'
import { selectNodeHandlePosition } from 'redux/modules/nodes'
import Vector2DUtils from 'utils/Vector2DUtils'

export default function NewEdge() {
  const newEdge = useAppSelector(selectTempEdge)

  if (newEdge === undefined) return null

  return <NewEdgeInternal handle={newEdge.handle} />
}

interface NewEdgeInternalProps {
  handle: NodeHandle
}

function NewEdgeInternal({ handle }: NewEdgeInternalProps) {
  const boardRef = useContext(BoardRefContext)
  const [clientPosition, setClientPosition] = useState<Vector2D>()

  const handlePosition = useAppSelector(selectNodeHandlePosition(handle), Vector2DUtils.equals)

  if (handlePosition === undefined) return null

  useWindowEventListener('mousemove', e => setClientPosition(Vector2DUtils.projectClientToBoard(e, boardRef.current)))

  return (
    <Curve
      positionStart={handle.type === NodeHandleType.Source ? handlePosition : (clientPosition ?? handlePosition)}
      positionEnd={handle.type === NodeHandleType.Target ? handlePosition : (clientPosition ?? handlePosition)}
    />
  )
}
