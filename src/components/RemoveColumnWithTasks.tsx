import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeColumn } from '../store/columnsSlice';
import { removeTask } from '../store/tasksSlice';
import type React from 'react';
import styles from '../styles/RemoveColumnWithTasks.module.css';
import { Trash } from 'lucide-react';

type Props = {
  columnId: string;
};

const RemoveColumnWithTasks: React.FC<Props> = ({ columnId }) => {
  const dispatch = useAppDispatch();
  const columnTasks = useAppSelector(state => state.columns.entities[columnId].taskIds);

  return (
    <button
      onClick={() => {
        columnTasks.forEach(taskId => {
          dispatch(removeTask(taskId));
        });
        dispatch(removeColumn(columnId));
      }}
      className={styles.button}
    >
      <Trash/>
    </button>
  );
};

export default RemoveColumnWithTasks;