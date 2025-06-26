import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Column } from '../types/types.ts';

const initialColumns: Record<string, Column> = {
  'column-1': {
    id: 'column-1',
    title: 'To Do',
    taskIds: ['task-1', 'task-2'],
  },
  'column-2': {
    id: 'column-2',
    title: 'In Progress',
    taskIds: ['task-3'],
  },
  'column-3': {
    id: 'column-3',
    title: 'Done',
    taskIds: [],
  },
};

const initialOrder: string[] = ['column-1', 'column-2', 'column-3'];

const columnsSlice = createSlice({
  name: 'columns',
  initialState: {
    entities: initialColumns,
    order: initialOrder,
  },
  reducers: {
    addColumn: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const newColumn: Column = {
        id: action.payload.id,
        title: action.payload.title,
        taskIds: [],
      };

      state.entities[action.payload.id] = newColumn;
      state.order.push(action.payload.id);
    },
    removeTaskFromColumn: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      state.entities[action.payload.columnId].taskIds = 
      state.entities[action.payload.columnId].taskIds.filter(id => id !== action.payload.taskId);
    },
    removeMarkedTasksFromColumns: (state, action: PayloadAction<string[]>) => {
      const markedIds = action.payload;

      for (const column of Object.values(state.entities)) {
        column.taskIds = column.taskIds.filter(id => !markedIds.includes(id));
      }
    },
    addTaskToColumn: (state, action: PayloadAction<{ columnId: string; taskId: string }>) => {
      state.entities[action.payload.columnId].taskIds.push(action.payload.taskId);
    },
    removeColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      delete state.entities[columnId];
      state.order = state.order.filter(id => id !== columnId);
    }
  },
});

export const { 
  addColumn,
  removeTaskFromColumn,
  addTaskToColumn,
  removeMarkedTasksFromColumns,
  removeColumn
} = columnsSlice.actions;
export default columnsSlice.reducer;