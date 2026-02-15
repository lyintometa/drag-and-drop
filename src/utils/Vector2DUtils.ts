import { BoardState } from 'contexts/BoardContext'
import MousePosition from 'models/MousePosition'
import Vector2D from 'models/Vector2D'

export default class Vector2DUtils {
  static add(addend1: Vector2D, addend2: Vector2D): Vector2D {
    return { x: addend1.x + addend2.x, y: addend1.y + addend2.y }
  }

  static subtract(minuend: Vector2D, subtrahend: Vector2D): Vector2D {
    return { x: minuend.x - subtrahend.x, y: minuend.y - subtrahend.y }
  }

  static multiply(multiplicand: Vector2D, multiplier: number): Vector2D {
    return { x: multiplicand.x * multiplier, y: multiplicand.y * multiplier }
  }

  static divide(quotient: Vector2D, dividend: number): Vector2D {
    return { x: quotient.x / dividend, y: quotient.y / dividend }
  }

  static projectClientToBoard({ clientX, clientY }: MousePosition, { offset, zoom }: BoardState): Vector2D {
    return {
      x: (clientX - offset.x + 0.5 * window.innerWidth * (zoom - 1)) / zoom,
      y: (clientY - offset.y + 0.5 * window.innerHeight * (zoom - 1)) / zoom,
    }
  }

  static getOffSet({ x, y }: Vector2D, zoom: number): Vector2D {
    return {
      x: 0.5 * window.innerWidth * (zoom - 1) - x * zoom,
      y: 0.5 * window.innerHeight * (zoom - 1) - y * zoom,
    }
  }

  static equals(vector1: Vector2D | undefined, vector2: Vector2D | undefined): boolean {
    if (vector1 === undefined) return vector2 === undefined
    if (vector2 === undefined) return false
    return vector1.x === vector2.x && vector1.y === vector2.y
  }
}
