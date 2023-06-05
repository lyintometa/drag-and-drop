import React, { useRef } from 'react'
import Node from '../Node/Node'
import { selectNodeIds } from '../../redux/modules/nodes'
import { useAppSelector } from '../../redux/hooks'
import Edge from '../Edge/Edge'
import { selectEdgeIds } from '../../redux/modules/edges'

interface Props {}

function Drawboard({}: Props) {
  const dummyRef = useRef<HTMLDivElement>(null)
  const nodes = useAppSelector(selectNodeIds)
  const edges = useAppSelector(selectEdgeIds)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setDragImage(dummyRef.current!, 0, 0)
  }

  return (
    <div
      style={{
        margin: 'auto',
        height: '1000px',
        width: '1500px',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1px solid black'
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: 999
        }}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <div ref={dummyRef} />
        {edges.map(id => (
          <Edge id={id} key={id} />
        ))}
        {nodes.map(id => (
          <Node id={id} key={id} />
        ))}
      </div>
    </div>
  )
}

export default Drawboard
