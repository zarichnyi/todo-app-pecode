export type Task = {
  id: string;
  text: string;
  completed: boolean;
  marked: boolean;
  column: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type RootState = {
  tasks: Record<string, Task>;
  columns: {
    columns: Record<string, Column>;
    columnOrder: string[];
  };
};