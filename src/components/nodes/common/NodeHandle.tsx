import { DetailedHTMLProps, HTMLAttributes, useCallback, useContext, useRef } from 'react'

import { BoardRefContext } from 'contexts/BoardContext'
import useResizeObserver from 'hooks/useResizeObserver'
import NodeHandleModel, { NodeHandleType } from 'models/NodeHandle'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { dropEdge, selectIsConnectedEdgeSelected, startEdge } from 'redux/modules/edges'
import { selectGrabbedHandle, selectIsHandleGrabbed, setGrabbedHandle, setHandlePosition } from 'redux/modules/nodes'
import HTMLElementUtils from 'utils/HTMLElementUtils'
import Vector2DUtils from 'utils/Vector2DUtils'
import { classNames } from 'utils/classNameUtils'

export interface NodeHandleProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  handle: NodeHandleModel
  style?: React.CSSProperties
}

const SIZE = 14
const OFFSET = { x: (SIZE * SIZE_FACTOR) / 2, y: (SIZE * SIZE_FACTOR) / 2 }

export default function NodeHandle({ className, handle, style, ...props }: NodeHandleProps) {
  const dispatch = useAppDispatch()
  const boardRef = useContext(BoardRefContext)

  const isEdgeSelected = useAppSelector(selectIsConnectedEdgeSelected(handle))
  const isGrabbed = useAppSelector(selectIsHandleGrabbed(handle))
  const grabbedHandle = useAppSelector(selectGrabbedHandle)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleResize = useCallback<ResizeObserverCallback>(() => {
    if (buttonRef.current === null) return

    dispatch(
      setHandlePosition({
        handle: handle,
        position: Vector2DUtils.add(
          Vector2DUtils.divide(HTMLElementUtils.getOffsetToId(buttonRef.current, handle.nodeId), boardRef.current.zoom),
          OFFSET,
        ),
      }),
    )
  }, [dispatch])

  useResizeObserver(handle.nodeId, handleResize)

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    dispatch(startEdge({ handle }))
    dispatch(setGrabbedHandle(handle))

    const handleMouseUp = () => dispatch(dropEdge())

    window.addEventListener('mouseup', handleMouseUp, { once: true, passive: true })
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    dispatch(dropEdge(handle))
    dispatch(setGrabbedHandle())
  }

  return (
    <button
      {...props}
      className={classNames(className, 'handle', {
        'edge-selected': isEdgeSelected,
        'grabbed': isGrabbed,
        'source': handle.type === NodeHandleType.Source,
        'target': handle.type === NodeHandleType.Target,
        'valid': grabbedHandle !== undefined && !isGrabbed && grabbedHandle.type !== handle.type,
      })}
      id={handle.nodeId + handle.key}
      ref={buttonRef}
      style={{ '--size-px': `${SIZE}px`, ...style } as React.CSSProperties}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
}
