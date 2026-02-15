import NodeHandle from './NodeHandle'

export default interface Edge {
  id: string
  source: NodeHandle
  target: NodeHandle
}

export interface NewEdge {
  handle: NodeHandle
}
