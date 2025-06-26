import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeMarkedTasksFromColumns } from '../store/columnsSlice';
import { removeMarkedTasks } from '../store/tasksSlice';
import styles from '../styles/RemoveMarkedTask.module.css';

const RemoveMarkedTask = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks);
  const markedIds = Object.values(tasks).filter(t => t.marked).map(t => t.id);

  return (
  <div>
    <button
      onClick={() => {
        dispatch(removeMarkedTasks());
        dispatch(removeMarkedTasksFromColumns(markedIds));
      }}
      className={styles.button}
    >
      Remove marked tasks
    </button>
  </div>
  );
};

export default RemoveMarkedTask;