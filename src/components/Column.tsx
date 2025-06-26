import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import Task from './Task';
import AddTaskModal from './AddTaskModal';
import RemoveColumnWithTasks from './RemoveColumnWithTasks';
import MarkAsAllTasksCompleted from './MarkAsAllTasksCompleted';
import SelectAllInColumn from './SelectAllInColumn';
import styles from '../styles/Column.module.css';

type ColumnProps = {
  columnId: string;
};

const COMPLETED = "completed";
const INCOMPLETED = "incompleted";
const NONE = "none";

const Column: React.FC<ColumnProps> = ({ columnId }) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<string>(NONE);
  const column = useAppSelector(state => state.columns.entities[columnId]);
  const tasks = useAppSelector(state => state.tasks);

  const taskList = useMemo(() => {
    if (filterBy === COMPLETED) {
      return column.taskIds
        .filter(taskId => tasks[taskId]?.completed)
        .map(taskId => tasks[taskId]);
    } else if (filterBy === INCOMPLETED) {
      return column.taskIds
        .filter(taskId => !tasks[taskId]?.completed)
        .map(taskId => tasks[taskId]);
    }
    return column.taskIds.map(taskId => tasks[taskId]);
  }, [filterBy, column.taskIds, tasks]);

  return (
    <div className={styles.columnContainer}>
      <div className={styles.filterSection}>
        <label htmlFor="taskFilter" className={styles.label}>Filter by:</label>
        <select
          name="taskFilter"
          id="taskFilter"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className={styles.select}
        >
          <option value={NONE}>None</option>
          <option value={COMPLETED}>Completed</option>
          <option value={INCOMPLETED}>Incompleted</option>
        </select>
      </div>
      <div className={styles.column}>
        <div className={styles.columnTitleWrapper}>
          <h3 className={styles.title}>{column.title}</h3>
          <RemoveColumnWithTasks columnId={columnId} />
        </div>
        <div className={styles.columnActions}>
          <MarkAsAllTasksCompleted columnId={columnId} />
          <SelectAllInColumn columnId={columnId} />
        </div>
        <div>
          <button onClick={() => setIsModalActive(true)} className={styles.addTaskButton}>
            Add task
          </button>
        </div>
        {taskList.map(task => (
          <Task key={task.id} task={task} columnId={columnId} />
        ))}
      </div>
      <AddTaskModal
        columnId={columnId}
        isOpen={isModalActive}
        setIsModalActive={setIsModalActive}
      />
    </div>
  );
};

export default Column;