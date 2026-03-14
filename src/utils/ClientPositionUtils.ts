import ClientPosition from 'models/ClientPosition'

export default class ClientPositionUtils {
  static equals(vector1: ClientPosition | undefined, vector2: ClientPosition | undefined): boolean {
    if (vector1 === undefined) return vector2 === undefined
    if (vector2 === undefined) return false
    return vector1.clientX === vector2.clientX && vector1.clientY === vector2.clientY
  }
}
