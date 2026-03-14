import { useEffect, useState } from 'react'

import Edge from 'components/Edge/Edge'
import NewEdge from 'components/Edge/NewEdge'
import CenterButton from 'components/common/CenterButton'
import Node from 'components/nodes/common/Node'
import useWindowEventListener from 'hooks/useWindowEventListener'
import { NodeHandleType } from 'models/NodeHandle'
import { DataType } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'
import BoardProvider from 'providers/BoardProvider'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import {
  deleteSelected,
  initialize,
  offsetSelectedPosition,
  selectArea,
  selectEdgeIds,
  selectNodeIds,
} from 'redux/modules/elements'

import Drawboard, { SelectAreaEvent } from './components/dragAndDrop/Drawboard'

export default function App() {
  const dispatch = useAppDispatch()
  const nodes = useAppSelector(selectNodeIds)
  const edges = useAppSelector(selectEdgeIds)

  const [wasRenderedAtLeastOnce, setWasRenderedAtLeastOnce] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    dispatch(
      initialize({
        nodes: [
          {
            id: 'randomUUID()',
            position: { x: 0, y: 0 },
            type: NodeType.Constant,
            handles: { return: { x: 0, y: 0 } },
            value: { dataType: DataType.String, value: '' },
          },
          {
            id: 'awd',
            position: { x: 100, y: 300 },
            type: NodeType.Constant,
            handles: { return: { x: 0, y: 0 } },
            value: { dataType: DataType.String, value: '123' },
          },
          {
            id: 'awd1',
            position: { x: 800, y: 300 },
            type: NodeType.Out,
            handles: { return: { x: 0, y: 0 } },
            value: {},
          },
          {
            id: 'add1',
            position: { x: 500, y: 100 },
            type: NodeType.Add,
            handles: { addend_1: { x: 0, y: 0 }, addend_2: { x: 0, y: 0 } },
            value: {},
          },
        ],
        edges: [
          {
            id: 'w',
            source: { nodeId: 'awd', key: 'return', type: NodeHandleType.Source },
            target: { nodeId: 'add1', key: 'addend_2', type: NodeHandleType.Target },
          },
        ],
      }),
    )
    setWasRenderedAtLeastOnce(true)
  }, [])

  const handleSelectArea = (e: SelectAreaEvent) => {
    dispatch(selectArea({ start: e.positionStart, end: e.positionEnd, shiftKey: e.shiftKey }))
  }

  useWindowEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
        dispatch(offsetSelectedPosition({ x: -1, y: 0 }))
        break
      case 'ArrowRight':
        dispatch(offsetSelectedPosition({ x: 1, y: 0 }))
        break
      case 'ArrowUp':
        dispatch(offsetSelectedPosition({ x: 0, y: -1 }))
        break
      case 'ArrowDown':
        dispatch(offsetSelectedPosition({ x: 0, y: 1 }))
        break
      case 'Delete':
        dispatch(deleteSelected())
        break
    }
  })

  return (
    <BoardProvider>
      <Drawboard onSelectArea={handleSelectArea}>
        {edges.map(id => (
          <Edge edgeId={id} key={id} />
        ))}
        <NewEdge />
        {nodes.map(id => (
          <Node id={id} key={id} />
        ))}
      </Drawboard>
      {!initialized && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(40, 40, 40)',
          }}
        />
      )}
      {wasRenderedAtLeastOnce && <CenterButton onInitialized={() => setInitialized(true)} />}
    </BoardProvider>
  )
}
