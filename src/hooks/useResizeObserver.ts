import { useEffect, useMemo } from 'react'

export default function useResizeObserver(elementId: string, callback: ResizeObserverCallback) {
  const observer = useMemo(() => new ResizeObserver(callback), [callback])

  useEffect(() => {
    const nodeElement = document.getElementById(elementId)
    if (nodeElement === null) return

    observer.observe(nodeElement)

    return () => observer.unobserve(nodeElement)
  }, [elementId, observer])
}
