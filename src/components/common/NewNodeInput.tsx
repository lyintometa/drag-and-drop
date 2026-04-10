import { useContext, useMemo, useRef, useState } from 'react'

import { BoardRefContext } from 'contexts/BoardContext'
import useWindowEventListener from 'hooks/useWindowEventListener'
import ClientPosition from 'models/ClientPosition'
import NodeTemplate from 'models/NodeTemplate'
import NodeType from 'models/NodeType'
import { useAppDispatch } from 'redux/hooks'
import { addNode } from 'redux/modules/elements'
import EnumUtils from 'utils/EnumUtils'
import RectangleUtils from 'utils/RectangleUtils'
import Vector2DUtils from 'utils/Vector2DUtils'

import AutoComplete, { AutoCompleteOption } from './AutoComplete'

const HEIGHT: number = 200
const WIDTH: number = 300
const PADDING: number = 20

export const HOTKEY_ADD_NEW_NODE = 'a'

export interface NewNodeInputProps {
  show?: boolean
  templates: NodeTemplate[]
  setShow?: (show: boolean) => void
}

export default function NewNodeInput({ show, templates, setShow }: NewNodeInputProps) {
  const dispatch = useAppDispatch()
  const boardRef = useContext(BoardRefContext)

  const [position, setPosition] = useState<ClientPosition>()
  const [value, setValue] = useState<string>('')
  const positionRef = useRef<ClientPosition>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useWindowEventListener('mousemove', e => (positionRef.current = { clientX: e.clientX, clientY: e.clientY }))

  useWindowEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setShow?.(false)
        break
      case HOTKEY_ADD_NEW_NODE:
        if (e.target instanceof HTMLInputElement) return
        e.preventDefault()
        setShow?.(true)

        const position = positionRef.current
        if (position === undefined) return

        const insetPosition = RectangleUtils.minimizeOverflow(
          { x: position.clientX, y: position.clientY, width: WIDTH, height: HEIGHT },
          { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
          PADDING,
        )
        setPosition({ clientX: insetPosition.x, clientY: insetPosition.y })
        setValue('')
        inputRef.current?.focus()
        break
    }
  })

  const options = useMemo<AutoCompleteOption[]>(
    () =>
      templates
        .filter(template => template.type !== NodeType.Out)
        .map(template => ({ name: template.name, description: template.description, value: template.type })),
    [templates],
  )

  if (!show) return null

  const handleSubmit = (value: string) => {
    if (position === undefined) return

    if (!EnumUtils.isMember(value, NodeType) || !options.some(option => option.value === value)) {
      console.error('error', value)
      return
    }

    dispatch(addNode({ type: value, position: Vector2DUtils.projectClientToBoard(position, boardRef.current) }))
    setShow?.(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()

    switch (e.key) {
      case 'Escape':
        setShow?.(false)
        break
    }
  }

  return (
    <AutoComplete
      autoFocus
      options={options}
      placeholder='Type to search... (Tab: Show all)'
      pt={{
        container: {
          style: {
            position: 'absolute',
            height: HEIGHT,
            width: WIDTH,
            left: position?.clientX,
            top: position?.clientY,
          },
        },
      }}
      ref={inputRef}
      value={value}
      onChange={setValue}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      onBlur={() => setShow?.(false)}
    />
  )
}
