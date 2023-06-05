import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { RootState } from '../store'

enum DataType {
  Unknown
}

interface ConstantNode {
  id: string
  dataType: DataType
  value: string
}

interface ConstantNodesState {
  allIds: string[]
  byId: {
    [id: string]: ConstantNode
  }
}

export const selectConstantNodeValue = (nodeId: string) => (state: RootState) => state.constantNodes.byId[nodeId].value

export const selectConstantNodes = (state: RootState) => state.constantNodes.allIds

const initialState: ConstantNodesState = {
  allIds: [],
  byId: {}
}

const initialStateTest: ConstantNodesState = {
  allIds: ['randomUUID()', 'awd'],
  byId: {
    'randomUUID()': { id: 'randomUUID()', dataType: DataType.Unknown, value: "" },
    awd: { id: 'awd', dataType: DataType.Unknown, value: "123"  }
  }
}

export const constantNodesSlice = createSlice({
  name: 'constantNodes',
  initialState: initialStateTest,
  reducers: {
    addConstantNode: (state, action: PayloadAction<string>) => {
      const newNode: ConstantNode = {
        id: action.payload,
        dataType: DataType.Unknown,
        value: ""
      }
      state.allIds.push(newNode.id)
      state.byId[newNode.id] = newNode
    },
    removeConstantNode: (state, action: PayloadAction<string>) => {
      const id = action.payload
      state.allIds = state.allIds.filter(_ => _ !== id)
      delete state.byId[id]
    },
    changeConstantValue: (state, action: PayloadAction<{id: string, value: any}>) => {      
      const { id, value } = action.payload
      state.byId[id].value = value
    }
  }
})

export const { addConstantNode, removeConstantNode, changeConstantValue } = constantNodesSlice.actions

export default constantNodesSlice.reducer
