import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice.ts';
import columnsReducer from './columnsSlice.ts';
import { loadState, saveState } from '../utils/localStorage';

const preloadedState = loadState();

const rootReducer = combineReducers({
  tasks: tasksReducer,
  columns: columnsReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  preloadedState,
});

// track chages in store if  smfng changes put it to localstorage
store.subscribe(() => {
  saveState({
    tasks: store.getState().tasks,
    columns: store.getState().columns,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;