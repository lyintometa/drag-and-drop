import Rectangle from 'models/Rectangle'
import Vector2D from 'models/Vector2D'

export default class RectangleUtils {
  static minimizeOverflow = (rectangle: Rectangle, container: Rectangle, padding: number = 0): Vector2D => ({
    x: Math.max(
      Math.min(rectangle.x, container.x + container.width - rectangle.width - padding),
      container.x + padding,
    ),
    y: Math.max(
      Math.min(rectangle.y, container.y + container.height - rectangle.height - padding),
      container.y + padding,
    ),
  })
}
