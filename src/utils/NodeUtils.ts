import Rectangle from 'models/Rectangle'
import { NodeState } from 'redux/modules/elements'

export default class NodeUtils {
  static getBoundingRect = (
    nodes: Pick<NodeState, 'id' | 'position' | 'calculatedSize'>[],
    currentZoom: number,
    padding: number = 0,
  ): Rectangle | undefined => {
    let xMin: number | undefined = undefined
    let xMax: number | undefined = undefined
    let yMin: number | undefined = undefined
    let yMax: number | undefined = undefined

    for (const node of nodes) {
      const element = document.getElementById(node.id)
      if (element === null) throw new Error(`Node '${node.id}' not found`)

      let width: number
      let height: number
      if (node.calculatedSize !== undefined) {
        width = node.calculatedSize.x
        height = node.calculatedSize.y
      } else {
        const boundingRect = element.getBoundingClientRect()
        width = boundingRect.width / currentZoom
        height = boundingRect.height / currentZoom
      }

      const { x: xLeft, y: yTop } = node.position
      const xRight = xLeft + width
      const yBottom = yTop + height

      xMin = xMin !== undefined ? Math.min(xMin, xLeft) : xLeft
      xMax = xMax !== undefined ? Math.max(xMax, xRight) : xRight
      yMin = yMin !== undefined ? Math.min(yMin, yTop) : yTop
      yMax = yMax !== undefined ? Math.max(yMax, yBottom) : yBottom
    }

    if (xMin === undefined || xMax === undefined || yMin === undefined || yMax === undefined) return undefined

    xMin -= padding
    yMin -= padding
    xMax += padding
    yMax += padding

    return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin }
  }
}
