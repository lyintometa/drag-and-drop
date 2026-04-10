import React, { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes, useMemo, useState } from 'react'

import { classNames } from 'utils/classNameUtils'

import './AutoComplete.css'

export interface AutoCompleteOption {
  name: string
  description?: string
  value: string
}

export interface AutocompleteProps extends Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'onChange' | 'onSubmit'
> {
  options: AutoCompleteOption[]
  value: string
  pt?: {
    container?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  }
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

export default function AutoComplete({
  options,
  value,
  pt,
  onBlur,
  onChange,
  onKeyDown,
  onSubmit,
  ...props
}: AutocompleteProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredOptions = useMemo(() => {
    if (value === undefined) return options
    return options.filter(option => option.name.toLowerCase().includes(value.toLowerCase()))
  }, [value, options])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
    setShowDropdown(e.target.value !== '')
  }

  const handleSubmitOption = (option: string) => {
    onSubmit?.(option)
    setShowDropdown(false)
  }

  const handleFocus = () => {
    /* return setShowDropdown(true) */
  }

  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.relatedTarget instanceof HTMLButtonElement
      && e.relatedTarget.attributes.getNamedItem('role')?.value === 'option'
    ) {
      return
    }

    setShowDropdown(false)
    onBlur?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      if (!e.shiftKey) {
        setShowDropdown(true)
      }

      if (e.shiftKey || filteredOptions.length === 0) {
        e.preventDefault()
      }
    }

    switch (e.key) {
      case 'Enter':
        onSubmit?.(value)
        break

      case 'Tab':
        if (filteredOptions.length === 0 || e.shiftKey) {
          e.preventDefault()
        }

        break
    }

    onKeyDown?.(e)
  }

  const { className: containerClassName, ...containerProps } = pt?.container ?? {}

  return (
    <div className={classNames('auto-complete', containerClassName)} {...containerProps}>
      <input
        className='input'
        type='text'
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlurInput}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <div
          className='dropdown'
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '250px',
            overflowY: 'auto',
            maxWidth: '300px',
          }}
        >
          {filteredOptions.map((option, index) => (
            <AutoCompleteOption
              key={option.value}
              isLast={index === filteredOptions.length - 1}
              onSelect={() => handleSubmitOption(option.value)}
              onKeyDown={() => (typeof props.ref === 'object' ? props.ref?.current?.focus() : undefined)}
              {...option}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface AutoCompleteOptionProps extends AutoCompleteOption {
  isLast: boolean
  onSelect?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
}

function AutoCompleteOption({ description, value, isLast, onSelect, onKeyDown }: AutoCompleteOptionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
        onSelect?.()
        break

      case 'Tab':
        if (isLast && !e.shiftKey) {
          e.preventDefault()
        }

        break
      case 'Shift':
        break

      default:
        if (/^([a-zA-Z0-9])$/.test(e.key)) {
          e.stopPropagation()
          onKeyDown?.(e)
        }

        break
    }
  }

  return (
    <button className='option' role='option' onClick={onSelect} onKeyDown={handleKeyDown}>
      <p className='option-name'>{value}</p>
      <p className='option-description'>{description}</p>
    </button>
  )
}
