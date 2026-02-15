import NodeType from './NodeType'
import Vector2D from './Vector2D'

export default interface Node<TValue = unknown> {
  id: string
  position: Vector2D
  type: NodeType
  handles: Record<string, Vector2D>
  value: TValue
}
