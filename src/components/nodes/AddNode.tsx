import { NodeHandleType } from 'models/NodeHandle'
import { NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'

import { NodeProps } from './common/Node'
import NodeHandle from './common/NodeHandle'
import NodeReturnParameterType from './common/NodeReturnParameterType'

const NODE_TEMPLATE = NODE_TEMPLATE_BY_TYPE[NodeType.Add]

export default function AddNode({ id }: NodeProps) {
  return (
    <>
      <p className='title' style={{ backgroundColor: 'yellow' }}>
        {NODE_TEMPLATE.name}
      </p>
      <div className='parameter-container'>
        <div className='parameters targets'>
          {Object.entries(NODE_TEMPLATE.inputParameters).map(([key, parameter]) => (
            <div className='parameter' key={key}>
              <p>{parameter.name}</p>
              <NodeHandle
                id={`${NodeType.Add}_${id}_${key}`}
                handle={{ nodeId: id, key: key, type: NodeHandleType.Target }}
              />
            </div>
          ))}
        </div>
        <div className='parameters sources'>
          {Object.entries(NODE_TEMPLATE.returnParameters).map(([key, returnValue]) => (
            <div className='parameter' key={key}>
              <p>{returnValue.name}</p>
              <NodeReturnParameterType nodeId={id} handleKey={key} />
              <NodeHandle
                id={`${NodeType.Add}_${id}_${key}`}
                handle={{ nodeId: id, key: key, type: NodeHandleType.Source }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
