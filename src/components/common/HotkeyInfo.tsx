import { Fragment } from 'react/jsx-runtime'

import { HOTKEY_ADD_NEW_NODE } from 'components/common/NewNodeInput'

import './HotkeyInfo.css'

interface Hotkey {
  text: string
  keys: string[]
}

const HOTKEYS: Hotkey[] = [
  { text: 'Add New Node', keys: [HOTKEY_ADD_NEW_NODE.toUpperCase()] },
  { text: 'Delete Selection', keys: ['Del'] },
  { text: 'Select Multiple', keys: ['Shift', 'LMB'] },
]

// ToDo: Extract icon to component
// https://www.svgrepo.com/svg/119940/mouse-left-button?edit=true
// 50% Trace Width 6% padding

export default function HotkeyInfo() {
  return (
    <table className='hotkey-info'>
      <tbody>
        {HOTKEYS.map(({ text, keys }) => (
          <HotkeyInfoItem key={text} keys={keys}>
            {text}
          </HotkeyInfoItem>
        ))}
      </tbody>
    </table>
  )
}

interface HotkeyInfoItemProps {
  children?: string
  keys: string[]
}

function HotkeyInfoItem({ children, keys }: HotkeyInfoItemProps) {
  return (
    <tr>
      <td className='keys'>
        {keys.map((key, index) => (
          <Fragment key={key}>
            {key === 'LMB' ?
              <svg
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='-21.39 -21.39 399.35 399.35'
                stroke='currentColor'
              >
                <g strokeLinecap='round' strokeLinejoin='round' stroke='#000000' strokeWidth='35.6572'>
                  <path d='M181.563,0C120.762,0,59.215,30.525,59.215,88.873V237.5c0,65.658,53.412,119.071,119.071,119.071 c65.658,0,119.07-53.413,119.07-119.071V88.873C297.356,27.809,237.336,0,181.563,0z M274.945,237.5 c0,53.303-43.362,96.657-96.659,96.657c-53.299,0-96.657-43.354-96.657-96.657v-69.513c20.014,6.055,57.685,15.215,102.221,15.215 c28.515,0,59.831-3.809,91.095-14.567V237.5z M274.945,144.794c-81.683,31.233-168.353,7.716-193.316-0.364V88.873 c0-43.168,51.489-66.46,99.934-66.46c46.481,0,93.382,20.547,93.382,66.46V144.794z M190.893,48.389v81.248 c0,6.187-5.023,11.208-11.206,11.208c-6.185,0-11.207-5.021-11.207-11.208V48.389c0-6.186,5.021-11.207,11.207-11.207 C185.869,37.182,190.893,42.203,190.893,48.389z M154.938,40.068V143.73c-15.879,2.802-62.566-10.271-62.566-10.271 C80.233,41.004,154.938,40.068,154.938,40.068z' />
                </g>
                <g>
                  <path d='M181.563,0C120.762,0,59.215,30.525,59.215,88.873V237.5c0,65.658,53.412,119.071,119.071,119.071 c65.658,0,119.07-53.413,119.07-119.071V88.873C297.356,27.809,237.336,0,181.563,0z M274.945,237.5 c0,53.303-43.362,96.657-96.659,96.657c-53.299,0-96.657-43.354-96.657-96.657v-69.513c20.014,6.055,57.685,15.215,102.221,15.215 c28.515,0,59.831-3.809,91.095-14.567V237.5z M274.945,144.794c-81.683,31.233-168.353,7.716-193.316-0.364V88.873 c0-43.168,51.489-66.46,99.934-66.46c46.481,0,93.382,20.547,93.382,66.46V144.794z M190.893,48.389v81.248 c0,6.187-5.023,11.208-11.206,11.208c-6.185,0-11.207-5.021-11.207-11.208V48.389c0-6.186,5.021-11.207,11.207-11.207 C185.869,37.182,190.893,42.203,190.893,48.389z M154.938,40.068V143.73c-15.879,2.802-62.566-10.271-62.566-10.271 C80.233,41.004,154.938,40.068,154.938,40.068z' />
                </g>
              </svg>
            : <p className='key' style={key.length > 1 ? { fontSize: 12 } : undefined}>
                {key}
              </p>
            }
            {index !== keys.length - 1 && <p className='description'>+</p>}
          </Fragment>
        ))}
      </td>
      <td className='description'>{children}</td>
    </tr>
  )
}
