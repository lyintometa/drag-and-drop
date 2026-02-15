import { useContext, useEffect, useEffectEvent } from 'react'

import { SetBoardContext, BoardRefContext } from 'contexts/BoardContext'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import { useAppStore } from 'redux/hooks'
import NodeUtils from 'utils/NodeUtils'
import Vector2DUtils from 'utils/Vector2DUtils'

import './CenterButton.css'

const PADDING = 100 * SIZE_FACTOR

interface CenterButtonProps {
  onInitialized?: () => void
}

export default function CenterButton({ onInitialized }: CenterButtonProps) {
  const store = useAppStore()
  const setBoard = useContext(SetBoardContext)
  const boardRef = useContext(BoardRefContext)

  const handleClick = useEffectEvent(() => {
    const nodes = Object.values(store.getState().nodes.byId)
    const boundingRect = NodeUtils.getBoundingRect(nodes, boardRef.current.zoom, PADDING)
    if (boundingRect === undefined) return

    const zoom = Math.min(window.innerWidth / boundingRect.width, window.innerHeight / boundingRect.height)
    const offsetCenter = {
      x: (window.innerWidth / zoom - boundingRect.width) / 2,
      y: (window.innerHeight / zoom - boundingRect.height) / 2,
    }

    setBoard(() => ({
      offset: Vector2DUtils.getOffSet(Vector2DUtils.subtract(boundingRect, offsetCenter), zoom),
      zoom,
    }))
  })

  useEffect(() => {
    handleClick()
    onInitialized?.()
  }, [])

  return (
    <button className='btn-center' onClick={handleClick}>
      Center
    </button>
  )
}
