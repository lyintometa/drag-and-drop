import { useEffect, useState } from 'react'

import Edge from 'components/Edge/Edge'
import NewEdge from 'components/Edge/NewEdge'
import CenterButton from 'components/common/CenterButton'
import HotkeyInfo from 'components/common/HotkeyInfo'
import NewNodeInput from 'components/common/NewNodeInput'
import Drawboard, { SelectAreaEvent } from 'components/dragAndDrop/Drawboard'
import Node from 'components/nodes/common/Node'
import useWindowEventListener from 'hooks/useWindowEventListener'
import { NodeHandleType } from 'models/NodeHandle'
import { DataType, NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'
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

import './App.css'

import SideMenu from 'components/common/SideMenu'
import ValueProvider from 'models/ValueProvider'

export default function App() {
  const dispatch = useAppDispatch()
  const nodes = useAppSelector(selectNodeIds)
  const edges = useAppSelector(selectEdgeIds)

  const [initialized, setInitialized] = useState(false)
  const [showNewNodeInput, setShowNewNodeInput] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>()

  const [wasRenderedAtLeastOnce, setWasRenderedAtLeastOnce] = useState(false)

  useEffect(() => {
    setWasRenderedAtLeastOnce(true)
  }, [wasRenderedAtLeastOnce])

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

  const handleSelectProvider = (provider: ValueProvider) => {
    if (provider.name === selectedProvider) return
    setSelectedProvider(provider.name)
    dispatch(initialize(provider.data))
    setWasRenderedAtLeastOnce(false)
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <SideMenu selectedProvider={selectedProvider} onSelect={handleSelectProvider} />
      <BoardProvider>
        <Drawboard onSelectArea={handleSelectArea}>
          {edges.map(id => (
            <Edge edgeId={id} key={selectedProvider + id} />
          ))}
          <NewEdge />
          {nodes.map(id => (
            <Node id={id} key={selectedProvider + id} />
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
        <NewNodeInput
          templates={Object.values(NODE_TEMPLATE_BY_TYPE)}
          show={showNewNodeInput}
          setShow={setShowNewNodeInput}
        />
        {wasRenderedAtLeastOnce && <CenterButton onInitialized={() => setInitialized(true)} />}
      </BoardProvider>
      <HotkeyInfo />
    </div>
  )
}
