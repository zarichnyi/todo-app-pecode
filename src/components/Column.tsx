import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { reorderTasksInColumn } from '../store/columnsSlice';
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
  const dispatch = useAppDispatch();
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

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    // Only reorder if we're showing all tasks (no filter applied)
    if (filterBy !== NONE) return;
    
    dispatch(reorderTasksInColumn({
      columnId,
      fromIndex: dragIndex,
      toIndex: hoverIndex
    }));
  };

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
        {filterBy !== NONE && (
          <div className={styles.filterNotice}>
            Drag-and-drop is disabled when filtering tasks
          </div>
        )}
        <div className={styles.taskList}>
          {taskList.map((task, index) => (
            <Task 
              key={task.id} 
              task={task} 
              columnId={columnId}
              index={index}
              onReorder={handleReorder}
            />
          ))}
        </div>
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