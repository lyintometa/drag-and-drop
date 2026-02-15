import React from 'react'

import { NodeHandleType } from 'models/NodeHandle'
import { NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectNodeValue, setNodeValue } from 'redux/modules/nodes'

import { NodeProps } from './common/Node'
import NodeHandle from './common/NodeHandle'
import NodeReturnParameterType from './common/NodeReturnParameterType'

const NODE_TEMPLATE = NODE_TEMPLATE_BY_TYPE[NodeType.Constant]

export default function ConstantNode({ id }: NodeProps) {
  const dispatch = useAppDispatch()
  const inputValues = useAppSelector(selectNodeValue<{ dataType: string; value: string }>(id))

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setNodeValue({ id, value: { ...inputValues, dataType: e.target.value } }))
  }

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNodeValue({ id, value: { ...inputValues, value: e.target.value } }))
  }

  return (
    <>
      <p className='title' style={{ backgroundColor: 'lightblue' }}>
        {NODE_TEMPLATE.name}
      </p>
      <div className='parameter-container'>
        <div className='parameters sources'>
          <div className='parameter'>
            <select value={inputValues.dataType} onChange={handleChange} onMouseDown={e => e.stopPropagation()}>
              <option>String</option>
              <option>Integer</option>
            </select>
            <input
              placeholder='Value'
              value={inputValues.value}
              onChange={handleChangeValue}
              onMouseDown={e => e.stopPropagation()}
            />
            <NodeReturnParameterType nodeId={id} handleKey='return' />
            <NodeHandle
              id={`${NODE_TEMPLATE.name}_${id}_${NODE_TEMPLATE.returnParameters['return']}`}
              handle={{ nodeId: id, key: 'return', type: NodeHandleType.Source }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
