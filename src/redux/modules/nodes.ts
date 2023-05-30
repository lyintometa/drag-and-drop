import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from "../store";

export interface Vector2D {
  x: number;
  y: number;
}

interface Node {
  id: string;
  position: Vector2D;
}

interface NodesState {
  allIds: string[];
  byId: {
    [id: string]: Node;
  };
  pickedUp: string | null;
  lastMove: number
  offset: Vector2D;
}

export const selectPosition = (nodeId: string) => (state: RootState) =>
  state.nodes.byId[nodeId].position;

export const selectNodes = (state: RootState) => state.nodes.allIds;

const initialState: NodesState = {
  allIds: [],
  byId: {},
  pickedUp: null,
  lastMove: Date.now(),
  offset: { x: 0, y: 0 },
};

const initialStateTest: NodesState = {
  allIds: ["randomUUID()"],
  byId: {
    "randomUUID()": { id: "randomUUID()", position: { x: 0, y: 0}}
  },
  pickedUp: null,
  lastMove: Date.now(),
  offset: { x: 0, y: 0 },
};

export const nodesSlice = createSlice({
  name: "nodes",
  initialState: initialStateTest,
  reducers: {
    addNode: (state, action: PayloadAction<Vector2D>) => {
      const position = action.payload;
      const newNode = {
        id: uuidv4(),
        position: {
          x: position.x - state.offset.x,
          y: position.y - state.offset.y,
        },
      };
      state.allIds.push(newNode.id);
      state.byId[newNode.id] = newNode;
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.allIds = state.allIds.filter((_) => _ !== id);
      delete state.byId[id];
    },
    setPosition: (state, action: PayloadAction<Node>) => {
      const now = Date.now()
      if (state.lastMove + 1000/144 > now) return
      state.lastMove = now
      
      const { id, position } = action.payload;
      state.byId[id].position.x = position.x - state.offset.x;
      state.byId[id].position.y = position.y - state.offset.y;
    },
    pickUp: (state, action: PayloadAction<Node>) => {
      const { id, position } = action.payload;
      state.pickedUp = id;
      state.offset.x = position.x - state.byId[id].position.x;
      state.offset.y = position.y - state.byId[id].position.y;
    },
  },
});

export const { addNode, removeNode, setPosition, pickUp } = nodesSlice.actions;

export default nodesSlice.reducer;
