import { NodeHandleType } from 'models/NodeHandle'
import NodeTemplate, { DataType, InputMethod, NODE_TEMPLATE_BY_TYPE } from 'models/NodeTemplate'
import NodeType from 'models/NodeType'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectNodeValue, setNodeValue } from 'redux/modules/elements'

import { NodeProps } from './common/Node'
import NodeHandle from './common/NodeHandle'
import NodeReturnParameterType from './common/NodeReturnParameterType'

interface GeneralNodeProps extends NodeProps {
  type: NodeType
}

export default function GeneralNode({ id, type }: GeneralNodeProps) {
  const NODE_TEMPLATE = NODE_TEMPLATE_BY_TYPE[type] as NodeTemplate

  const dispatch = useAppDispatch()
  const inputValues = useAppSelector(selectNodeValue<Record<string, unknown>>(id))

  const handleChangeValue = (key: string, value?: string) => {
    dispatch(setNodeValue({ id, value: { ...inputValues, [key]: value } }))
  }

  return (
    <>
      <p
        className='title'
        style={{
          backgroundColor:
            NODE_TEMPLATE.isGroup ? 'orange'
            : Object.keys(NODE_TEMPLATE.inputParameters).length > 0 ? 'yellow'
            : 'lightblue',
        }}
      >
        {NODE_TEMPLATE.name}
      </p>
      <div className='parameter-container'>
        <div className='parameters manual'>
          {Object.entries(NODE_TEMPLATE.inputParameters)
            .filter(([, parameter]) => parameter.inputMethod === InputMethod.Manual)
            .map(([key, parameter]) => (
              <div className='parameter' key={key}>
                <p>{parameter.name}</p>

                {parameter.allowedDataTypes?.includes(DataType.Enumeration) ?
                  <select
                    value={inputValues[key] as string}
                    onChange={e => handleChangeValue(key, e.target.value)}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    {parameter.options?.map(option => (
                      <option key={option.value}>{option.value}</option>
                    ))}
                  </select>
                : <input
                    value={inputValues[key] as string}
                    onChange={e => handleChangeValue(key, e.target.value)}
                    onMouseDown={e => e.stopPropagation()}
                  />
                }
              </div>
            ))}
        </div>
        <div className='parameters targets'>
          {Object.entries(NODE_TEMPLATE.inputParameters)
            .filter(([, parameter]) => parameter.inputMethod === InputMethod.Sink)
            .map(([key, parameter]) => (
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
          {Object.entries(NODE_TEMPLATE.returnValue).map(([key, returnValue]) => (
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
