import Edge from './Edge'
import Node from './Node'

export default interface ValueProvider {
  name: string
  data: { nodes: Node[]; edges: Edge[] }
}
