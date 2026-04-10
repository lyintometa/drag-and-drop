import NodeType from './NodeType'

export default interface NodeTemplate {
  type: NodeType
  name: string
  isGroup?: boolean
  description: string
  genericParameters?: Record<string, object>
  inputParameters: Record<string, NodeInputParameter>
  returnValue: Record<string, NodeReturnParameter>
}

export interface NodeInputParameter {
  name: string
  description: string
  genericDataType?: string
  setsGenericDataType?: string
  allowedDataTypes?: DataType[]
  options?: NodeInputParameterOption[]
  inputMethod: InputMethod
}

export interface NodeInputParameterOption {
  value: DataType
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
    type: NodeType.Add,
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
    returnValue: {
      result: {
        name: 'Result',
        description: 'The resulting value',
        dataType: { type: 'generic', name: 'TValue' },
      },
    },
  },
  [NodeType.Constant]: {
    type: NodeType.Constant,
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
        allowedDataTypes: [DataType.Enumeration],
        setsGenericDataType: 'TValue',
        options: [{ value: DataType.String }, { value: DataType.Integer }],
      },
      value: {
        name: 'Value',
        description: 'The value to return',
        inputMethod: InputMethod.Manual,
        genericDataType: 'TValue',
      },
    },
    returnValue: {
      return: {
        name: 'Return',
        description: 'The value to return',
      },
    },
  },
  [NodeType.CurrentContext]: {
    type: NodeType.CurrentContext,
    name: 'Current Context',
    description: 'Provides context information',
    inputParameters: {},
    returnValue: {
      productionOrder: {
        name: 'Production Order',
        description: 'The production order information',
      },
      equipment: {
        name: 'Equipment',
        description: 'The equipment information',
      },
    },
  },
  [NodeType.Out]: {
    type: NodeType.Out,
    name: 'Provider Value',
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
    returnValue: {},
  },
  [NodeType.PlcValue]: {
    type: NodeType.PlcValue,
    name: 'PLC Value',
    description: 'Reads a bit form PLC',
    genericParameters: {
      TValue: {
        extendsAnyOf: [['string'], ['integer']],
      },
    },
    inputParameters: {
      name: {
        name: 'Name',
        description: 'The name of the PLC bit',
        allowedDataTypes: [DataType.String],
        inputMethod: InputMethod.Sink,
      },
      dataType: {
        name: 'Data Type',
        description: 'The data type',
        inputMethod: InputMethod.Manual,
        allowedDataTypes: [DataType.Enumeration],
        setsGenericDataType: 'TValue',
        options: [{ value: DataType.String }, { value: DataType.Integer }],
      },
      equipment: {
        name: 'Equipment',
        description: 'The equipment',
        allowedDataTypes: [DataType.String],
        inputMethod: InputMethod.Sink,
      },
    },
    returnValue: {
      value: {
        name: 'Value',
        description: 'The value of the PLC bit',
        dataType: { type: 'generic', name: 'TValue' },
      },
    },
  },
  [NodeType.ProductionCounterTEMP]: {
    type: NodeType.ProductionCounterTEMP,
    name: 'Production Counter',
    isGroup: true,
    description: 'Reads the production counter from a PLC',
    inputParameters: {
      equipment: {
        name: 'Equipment',
        description: 'The equipment',
        allowedDataTypes: [DataType.String],
        inputMethod: InputMethod.Sink,
      },
    },
    returnValue: {
      value: {
        name: 'Value',
        description: 'The value of the PLC bit',
        dataType: { type: 'constant', name: DataType.Integer },
      },
    },
  },
} satisfies Record<NodeType, NodeTemplate>
