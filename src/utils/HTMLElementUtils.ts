import Vector2DUtils from './Vector2DUtils'

export default class HTMLElementUtils {
  static getOffsetToId = (element: HTMLElement, id: string) => {
    const rect = element.getBoundingClientRect()
    const rect2 = document.getElementById(id)?.getBoundingClientRect()

    if (rect2 === undefined) {
      return { x: 0, y: 0 }
    }

    return Vector2DUtils.subtract(rect, rect2)
  }

  static getOffsetToId2 = (element: HTMLElement, id: string) => {
    const offset = { x: 0, y: 0 }
    let i = 10

    while (element.id !== id) {
      if (i === 0) throw new Error('HTMLElementUtils.getOffsetToId Depth exceeded')

      console.log(element.tagName, element.id, element.offsetLeft, element.offsetTop)
      offset.x += element.offsetLeft
      offset.y += element.offsetTop

      element = element.parentElement!

      i--
    }

    return offset
  }
}
