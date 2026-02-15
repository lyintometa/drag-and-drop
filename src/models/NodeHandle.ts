export default interface NodeHandle {
  nodeId: string
  key: string
  type: NodeHandleType
}

export enum NodeHandleType {
  Source = 'source',
  Target = 'target',
}
