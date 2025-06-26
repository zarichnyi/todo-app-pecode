import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../types/types.ts';

const initialTasks: Record<string, Task> = {
  'task-1': { id: 'task-1', text: 'Read book', completed: false, marked: false, column: 'column-1' },
  'task-2': { id: 'task-2', text: 'Write code', completed: true, marked: true, column: 'column-1' },
  'task-3': { id: 'task-3', text: 'Test app', completed: false, marked: false, column: 'column-2' },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasks,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state[action.payload.id] = action.payload;
    },
    editTask: (state, action: PayloadAction<{ id:string, text: string}>) => {
      state[action.payload.id].text = action.payload.text;
    },
    removeTask: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    toggleTaskCompleted: (state, action: PayloadAction<string>) => {
      const task = state[action.payload];
      if (task) {
        task.completed = !task.completed;
      }
    },
    toggleTaskMark: (state, action: PayloadAction<string>) => {
      const task = state[action.payload];
      if (task) {
        task.marked = !task.marked;
      }
    },
    removeMarkedTasks: (state) => {
      for (const id in state) {
        if (state[id].marked) {
          delete state[id];
        }
      }
    },
    markAllAsCompleted: (state, action: PayloadAction<{value: boolean, columnId: string}>) => {
      Object.values(state).forEach(task => {
        if(task.column === action.payload.columnId){
          task.completed = action.payload.value
        }
      });
    },
    selectAllinColumn:(state, action: PayloadAction<{value: boolean, columnId: string}>) => {
      Object.values(state).forEach(task => {
        if(task.column === action.payload.columnId){
          task.marked = action.payload.value
        }
      });
    }
},
});

export const { 
    addTask,
    editTask,
    removeTask,
    toggleTaskCompleted,
    toggleTaskMark,
    removeMarkedTasks,
    markAllAsCompleted,
    selectAllinColumn
  } = tasksSlice.actions;
export default tasksSlice.reducer;
