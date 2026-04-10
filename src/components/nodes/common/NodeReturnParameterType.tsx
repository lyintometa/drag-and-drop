import useReturnParameterType from 'hooks/useReturnParameterType'

export interface NodeReturnParameterTypeProps {
  handleKey: string
  nodeId: string
}

export default function NodeReturnParameterType({ handleKey, nodeId }: NodeReturnParameterTypeProps) {
  const calculatedDataType = useReturnParameterType(nodeId, handleKey)

  if (calculatedDataType === null) return null

  return <p>({calculatedDataType})</p>
}
