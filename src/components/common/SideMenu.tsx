import { useValueProviders } from 'api/valueProviders'

import './SideMenu.css'

import { useEffect } from 'react'

import ValueProvider from 'models/ValueProvider'
import { classNames } from 'utils/classNameUtils'

export interface SideMenuItem {
  label: string
}

interface SideMenuProps {
  selectedProvider?: string
  onSelect?: (provider: ValueProvider) => void
}

export default function SideMenu({ selectedProvider, onSelect }: SideMenuProps) {
  const valueProviders = useValueProviders()

  const getHandleClick = (provider: ValueProvider) => () => onSelect?.(provider)

  useEffect(() => {
    if (valueProviders.length === 0 || selectedProvider !== undefined) return
    onSelect?.(valueProviders[0]!)
  }, [])

  return (
    <div className='side-menu'>
      <div className='side-menu-header'>
        <p className='side-menu-title'>Value Providers</p>
      </div>
      <div className='side-menu-item-container'>
        {valueProviders.map(provider => (
          <SideMenuItem
            key={provider.name}
            label={provider.name}
            onClick={getHandleClick(provider)}
            isSelected={provider.name === selectedProvider}
          />
        ))}
      </div>
    </div>
  )
}

interface SideMenuItemProps extends SideMenuItem {
  onClick?: () => void
  isSelected?: boolean
}

function SideMenuItem({ label, onClick, isSelected }: SideMenuItemProps) {
  return (
    <button className={classNames('side-menu-item', { 'selected': isSelected })} onClick={onClick}>
      {label}
    </button>
  )
}
