import useReturnParameterType from 'hooks/useReturnParameterType'

export interface NodeReturnParameterTypeProps {
  handleKey: string
  nodeId: string
}

export default function NodeReturnParameterType({ handleKey, nodeId }: NodeReturnParameterTypeProps) {
  const calculatedDataType = useReturnParameterType(nodeId, handleKey)

  return <p>({calculatedDataType})</p>
}
