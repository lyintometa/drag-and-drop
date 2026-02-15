import { useCallback, useMemo } from 'react'
import { shallowEqual } from 'react-redux'

import { DataType } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'
import { useAppSelector } from 'redux/hooks'

export default function useReturnParameterType(nodeId: string, parameterName: string): DataType | null {
  const nodesById = useAppSelector(state => state.nodes.byId)
  const edges = useAppSelector(state => Object.values(state.edges.byId), shallowEqual)

  const getReturnParameterTypeRecursive = useCallback(
    (nodeId: string, parameterName: string): DataType | null => {
      const node = nodesById[nodeId]
      if (node === undefined) throw new Error(`Node ${nodeId} not found`)

      switch (node.type) {
        case NodeType.Constant:
          switch (parameterName) {
            case 'return':
              return (node.value as { dataType: DataType }).dataType
            default:
              throw new Error(`Return parameter '${parameterName}' does not exist on node type '${node.type}'`)
          }

        case NodeType.Add:
          switch (parameterName) {
            case 'result':
              const edgeToAddend1 = edges.find(edge => edge.target.nodeId === nodeId && edge.target.key === 'addend_1')

              let addend1Type: DataType | null = null
              let addend2Type: DataType | null = null

              if (edgeToAddend1 !== undefined) {
                addend1Type = getReturnParameterTypeRecursive(edgeToAddend1.source.nodeId, edgeToAddend1.source.key)
              }

              const edgeToAddend2 = edges.find(edge => edge.target.nodeId === nodeId && edge.target.key === 'addend_2')
              if (edgeToAddend2 !== undefined) {
                addend2Type = getReturnParameterTypeRecursive(edgeToAddend2.source.nodeId, edgeToAddend2.source.key)
              }

              if (addend1Type === DataType.String || addend2Type === DataType.String) return DataType.String
              return DataType.Integer

            default:
              throw new Error(`Return parameter '${parameterName}' does not exist on node type '${node.type}'`)
          }

        case NodeType.Out:
          switch (parameterName) {
            default:
              throw new Error(`Return parameter '${parameterName}' does not exist on node type '${node.type}'`)
          }

        default:
          throw new Error(`Node type '${node.type satisfies never}' does not exist`)
      }
    },
    [nodesById, edges],
  )

  return useMemo(
    () => getReturnParameterTypeRecursive(nodeId, parameterName),
    [nodeId, parameterName, getReturnParameterTypeRecursive],
  )
}
