import { NodeHandleType } from 'models/NodeHandle'
import NodeTemplate, { InputMethod, NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'

import { NodeProps } from './common/Node'
import NodeHandle from './common/NodeHandle'
import NodeReturnParameterType from './common/NodeReturnParameterType'

interface GeneralNodeProps extends NodeProps {
  type: NodeType
}

export default function GeneralNode({ id, type }: GeneralNodeProps) {
  const NODE_TEMPLATE = NODE_TEMPLATE_BY_TYPE[type] as NodeTemplate

  return (
    <>
      <p className='title' style={{ backgroundColor: 'grey' }}>
        {NODE_TEMPLATE.name}
      </p>
      <div style={{ padding: '4px 12px' }}>
        {Object.entries(NODE_TEMPLATE.inputParameters)
          .filter(([, parameter]) => parameter.inputMethod === InputMethod.Sink)
          .map(([key, parameter]) => (
            <div className='parameter target' key={key}>
              <p>{parameter.name}</p>
              <NodeHandle
                id={`${NodeType.Add}_${id}_${key}`}
                handle={{ nodeId: id, key: key, type: NodeHandleType.Target }}
              />
            </div>
          ))}
        {Object.entries(NODE_TEMPLATE.returnParameters).map(([key, returnValue]) => (
          <div className='parameter source' key={key}>
            <p>{returnValue.name}</p>
            <NodeReturnParameterType nodeId={id} handleKey={key} />
            <NodeHandle
              id={`${NodeType.Add}_${id}_${key}`}
              handle={{ nodeId: id, key: key, type: NodeHandleType.Source }}
            />
          </div>
        ))}
      </div>
    </>
  )
}
