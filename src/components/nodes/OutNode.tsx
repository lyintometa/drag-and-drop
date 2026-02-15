import { NodeHandleType } from 'models/NodeHandle'
import { NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'

import { NodeProps } from './common/Node'
import NodeHandle from './common/NodeHandle'

const NODE_TEMPLATE = NODE_TEMPLATE_BY_TYPE[NodeType.Out]

export default function OutNode({ id }: NodeProps) {
  return (
    <>
      <p className='title' style={{ backgroundColor: 'coral' }}>
        {NODE_TEMPLATE.name}
      </p>
      <div className='parameter-container'>
        <div className='parameters targets'>
          <div className='parameter'>
            <p>{NODE_TEMPLATE.inputParameters['value'].name}</p>
            <NodeHandle handle={{ nodeId: id, key: 'value', type: NodeHandleType.Target }} />
          </div>
        </div>
      </div>
    </>
  )
}
