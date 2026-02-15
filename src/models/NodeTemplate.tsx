import NodeType from './NodeType'

export default interface NodeTemplate {
  name: string
  description: string
  genericParameters?: Record<string, object>
  inputParameters: Record<string, NodeInputParameter>
  returnParameters: Record<string, NodeReturnParameter>
}

export interface NodeInputParameter {
  name: string
  description: string
  genericDataType?: string
  allowedDataTypes?: DataType[]
  inputMethod: InputMethod
}

export interface NodeReturnParameter {
  name: string
  description: string
  dataType?: {
    type: 'generic' | 'constant'
    name: string
  }
  canSetType?: boolean
}

export enum DataType {
  Integer = 'Integer',
  Enumeration = 'Enumeration',
  String = 'String',
}

export enum InputMethod {
  Sink,
  Manual,
}

export const NODE_TEMPLATE_BY_TYPE = {
  [NodeType.Add]: {
    name: 'Add',
    description: 'Adds two values together',
    genericParameters: {
      TValue: {
        extendsAnyOf: [['string'], ['integer']],
      },
    },
    inputParameters: {
      addend_1: {
        name: 'Addend 1',
        description: 'The first addend',
        genericDataType: 'TValue',
        inputMethod: InputMethod.Sink,
      },
      addend_2: {
        name: 'Addend 2',
        description: 'The second addend',
        genericDataType: 'TValue',
        inputMethod: InputMethod.Sink,
      },
    },
    returnParameters: {
      result: {
        name: 'Result',
        description: 'The resulting value',
        dataType: { type: 'generic', name: 'TValue' },
      },
    },
  },
  [NodeType.Constant]: {
    name: 'Constant',
    description: 'Returns a constant value',
    genericParameters: {
      TValue: {
        extendsAnyOf: [['string'], ['integer']],
      },
    },
    inputParameters: {
      dataType: {
        name: 'Data Type',
        description: 'The data type of the value',
        inputMethod: InputMethod.Manual,
      },
      value: {
        name: 'Value',
        description: 'The value to return',
        inputMethod: InputMethod.Manual,
      },
    },
    returnParameters: {
      return: {
        name: 'Return',
        description: 'The value to return',
      },
    },
  },
  [NodeType.Out]: {
    name: 'Out',
    description: 'Returns a constant value',
    inputParameters: {
      dataType: {
        name: 'Data Type',
        description: 'The data type',
        allowedDataTypes: [DataType.Enumeration],
        inputMethod: InputMethod.Manual,
      },
      value: {
        name: 'Value',
        description: 'The value',
        allowedDataTypes: [DataType.Integer],
        inputMethod: InputMethod.Sink,
      },
    },
    returnParameters: {},
  },
} satisfies Record<NodeType, NodeTemplate>
