import MousePosition from 'models/MousePosition'

export default class MousePositionUtils {
  static equals(vector1: MousePosition | undefined, vector2: MousePosition | undefined): boolean {
    if (vector1 === undefined) return vector2 === undefined
    if (vector2 === undefined) return false
    return vector1.clientX === vector2.clientX && vector1.clientY === vector2.clientY
  }
}
