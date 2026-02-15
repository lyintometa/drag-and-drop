import { SVGProps, useContext } from 'react'

import { ZoomContext } from 'contexts/BoardContext'
import Vector2D from 'models/Vector2D'
import { SIZE_FACTOR } from 'providers/BoardProvider'
import { classNames } from 'utils/classNameUtils'

import './Curve.css'

const DEBUG = false

const PADDING_Y = 15 * SIZE_FACTOR
const BASE_PADDING_X = 50 * SIZE_FACTOR
const PADDING_X_MULTIPLIER = 0.04 * SIZE_FACTOR
const CONTROL_POINT_OFFSET_MIN = 100 * SIZE_FACTOR
const INSET_X = 11 * SIZE_FACTOR

export interface CurveProps extends Omit<SVGProps<SVGSVGElement>, 'onClick' | 'height' | 'width'> {
  isSelected?: boolean
  positionStart: Vector2D
  positionEnd: Vector2D
  pt?: {
    body?: SVGProps<SVGPathElement>
  }
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void
}

export default function Curve({
  className,
  isSelected,
  positionStart,
  positionEnd,
  pt,
  style,
  onClick,
  ...props
}: CurveProps) {
  const zoom = useContext(ZoomContext)

  const width = Math.abs(positionStart.x - positionEnd.x)
  const height = Math.abs(positionStart.y - positionEnd.y)

  const isStartLeft = positionStart.x <= positionEnd.x
  const isStartTop = positionStart.y <= positionEnd.y

  const paddingX = isStartLeft ? BASE_PADDING_X : BASE_PADDING_X + width * PADDING_X_MULTIPLIER
  const controlPointOffset = Math.max(CONTROL_POINT_OFFSET_MIN, width / 3)

  const x0 = isStartLeft ? paddingX + INSET_X : paddingX + INSET_X + width
  const x3 = isStartLeft ? paddingX - INSET_X + width : paddingX - INSET_X
  const x1 = x0 + Math.max(Math.min(controlPointOffset, Math.abs(x3 - x0) / 1.4), INSET_X) + 2 * INSET_X
  const x2 = x3 - Math.max(Math.min(controlPointOffset, Math.abs(x3 - x0) / 1.4), INSET_X) - 2 * INSET_X

  const y01 = isStartTop ? PADDING_Y : PADDING_Y + height
  const y23 = isStartTop ? PADDING_Y + height : PADDING_Y

  const left = (isStartLeft ? positionStart.x : positionEnd.x) - paddingX
  const top = (isStartTop ? positionStart.y : positionEnd.y) - PADDING_Y

  return (
    <svg
      className={classNames(className, 'dnd-curve', { 'dnd-selected': isSelected })}
      width={width + paddingX * 2}
      height={height + PADDING_Y * 2}
      style={{ ...style, top: top, left: left, border: DEBUG ? '1px solid black' : undefined }}
      {...props}
    >
      <path
        className={classNames('dnd-outline', { 'dnd-selected': isSelected })}
        d={['M', x0, y01, 'C', x1, y01, x2, y23, x3, y23].join(' ')}
      />

      <path
        className={classNames('dnd-border', { 'dnd-selected': isSelected })}
        d={['M', x0, y01, 'C', x1, y01, x2, y23, x3, y23].join(' ')}
      />

      <path
        className={classNames('dnd-body', { 'dnd-selected': isSelected })}
        d={['M', x0, y01, 'C', x1, y01, x2, y23, x3, y23].join(' ')}
        {...pt?.body}
      />

      {onClick !== undefined && (
        <path
          className='dnd-path-area'
          d={['M', x0, y01, 'C', x1, y01, x2, y23, x3, y23].join(' ')}
          stroke={DEBUG ? '#ffff0070' : 'transparent'}
          strokeWidth={(Math.min(Math.max(15 / zoom, 4), 20) * SIZE_FACTOR).toString()}
          onClick={onClick}
          onMouseDown={e => e.stopPropagation()}
        />
      )}

      {DEBUG && (
        <>
          <circle r={2 * SIZE_FACTOR} cx={x0} cy={y01} fill='red' />
          <circle r={2 * SIZE_FACTOR} cx={x1} cy={y01} fill='red' />
          <circle r={2 * SIZE_FACTOR} cx={x2} cy={y23} fill='red' />
          <circle r={2 * SIZE_FACTOR} cx={x3} cy={y23} fill='red' />
        </>
      )}
    </svg>
  )
}
