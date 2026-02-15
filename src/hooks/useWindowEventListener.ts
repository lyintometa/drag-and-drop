import { useEffect, useEffectEvent } from 'react'

export default function useWindowEventListener<K extends keyof WindowEventMap>(
  ...[type, listener, options]: Parameters<typeof window.addEventListener<K>>
): void {
  const listenerInternal = useEffectEvent(listener)

  useEffect(() => {
    window.addEventListener(type, listenerInternal, options)
    return () => window.removeEventListener(type, listenerInternal)
  }, [type])
}
