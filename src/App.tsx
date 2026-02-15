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
import { useAppDispatch, useAppSelector, useAppStore } from 'redux/hooks'
import {
  deleteSelectedEdge,
  initializeEdges,
  removeEdges,
  selectEdgeIds,
  selectEdgesForNode,
  setSelectedEdge,
} from 'redux/modules/edges'
import { deleteSelectedNode, initializeNodes, selectNodeIds, setSelectedNode } from 'redux/modules/nodes'
import MousePositionUtils from 'utils/MousePositionUtils'

import Drawboard from './components/dragAndDrop/Drawboard'

export default function App() {
  const dispatch = useAppDispatch()
  const nodes = useAppSelector(selectNodeIds)
  const edges = useAppSelector(selectEdgeIds)
  const store = useAppStore()

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    dispatch(
      initializeNodes([
        {
          id: 'randomUUID()',
          position: { x: 0, y: 0 },
          type: NodeType.Constant,
          handles: {},
          value: { dataType: DataType.String, value: '' },
        },
        {
          id: 'awd',
          position: { x: 100, y: 300 },
          type: NodeType.Constant,
          handles: {},
          value: { dataType: DataType.String, value: '123' },
        },
        {
          id: 'awd1',
          position: { x: 800, y: 300 },
          type: NodeType.Out,
          handles: {},
          value: {},
        },
        {
          id: 'add1',
          position: { x: 500, y: 100 },
          type: NodeType.Add,
          handles: {},
          value: {},
        },
      ]),
    )

    dispatch(
      initializeEdges([
        {
          id: 'w',
          source: { nodeId: 'awd', key: 'return', type: NodeHandleType.Source },
          target: { nodeId: 'add1', key: 'addend_2', type: NodeHandleType.Target },
        },
      ]),
    )
  }, [])

  useWindowEventListener('mousedown', downEvent => {
    window.addEventListener(
      'mouseup',
      upEvent => {
        if (!MousePositionUtils.equals(downEvent, upEvent)) return
        dispatch(setSelectedEdge(undefined))
        dispatch(setSelectedNode(undefined))
      },
      { once: true },
    )
  })

  useWindowEventListener('keydown', e => {
    if (e.key !== 'Delete') return
    const state = store.getState()

    if (state.nodes.selectedId !== undefined) {
      dispatch(removeEdges(selectEdgesForNode(state.nodes.selectedId)(state).map(edge => edge.id)))
      dispatch(deleteSelectedNode())
    }

    if (state.edges.selectedId !== undefined) {
      dispatch(deleteSelectedEdge())
    }
  })

  return (
    <BoardProvider>
      <Drawboard>
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
      {nodes.length > 0 && <CenterButton onInitialized={() => setInitialized(true)} />}
    </BoardProvider>
  )
}
