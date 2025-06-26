import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { reorderTasksInColumn, removeTaskFromColumn, addTaskToColumn } from '../store/columnsSlice';
import { updateTaskColumn } from '../store/tasksSlice';
import Task from './Task';
import AddTaskModal from './AddTaskModal';
import RemoveColumnWithTasks from './RemoveColumnWithTasks';
import MarkAsAllTasksCompleted from './MarkAsAllTasksCompleted';
import SelectAllInColumn from './SelectAllInColumn';
import styles from '../styles/Column.module.css';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type ColumnProps = {
  columnId: string;
};

const COMPLETED = "completed";
const INCOMPLETED = "incompleted";
const NONE = "none";

const Column: React.FC<ColumnProps> = ({ columnId }) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<string>(NONE);
  const [isColumnDropTarget, setIsColumnDropTarget] = useState(false);
  const dispatch = useAppDispatch();
  const column = useAppSelector(state => state.columns.entities[columnId]);
  const tasks = useAppSelector(state => state.tasks);
  const columnRef = useRef<HTMLDivElement>(null);

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

  // Set up column as drop target for cross-column moves
  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: () => ({ 
        columnId, 
        type: 'column' 
      }),
      onDragEnter: ({ source }) => {
        // Only show drop target if dragging a task from a different column
        if (source.data.type === 'task' && source.data.columnId !== columnId) {
          setIsColumnDropTarget(true);
        }
      },
      onDragLeave: () => setIsColumnDropTarget(false),
      onDrop: ({ source }) => {
        setIsColumnDropTarget(false);
        
        if (source.data.type !== 'task' || source.data.columnId === columnId) {
          return;
        }

        // Move task to end of this column
        handleMoveToColumn(
          source.data.taskId as string,
          source.data.columnId as string,
          columnId,
          column.taskIds.length // Add to end
        );
      },
      canDrop: ({ source }) => {
        return source.data.type === 'task' && source.data.columnId !== columnId;
      },
    });

    return cleanupDropTarget;
  }, [columnId, column.taskIds.length]);

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    // Only reorder if we're showing all tasks (no filter applied)
    if (filterBy !== NONE) return;
    
    dispatch(reorderTasksInColumn({
      columnId,
      fromIndex: dragIndex,
      toIndex: hoverIndex
    }));
  };

  const handleMoveToColumn = (taskId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => {
    // Remove from source column
    dispatch(removeTaskFromColumn({ taskId, columnId: sourceColumnId }));
    
    // Add to target column at specific position
    dispatch(addTaskToColumn({ columnId: targetColumnId, taskId, index: targetIndex }));
    
    // Update task's column reference
    dispatch(updateTaskColumn({ taskId, columnId: targetColumnId }));
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
      <div 
        ref={columnRef}
        className={`${styles.column} ${isColumnDropTarget ? styles.columnDropTarget : ''}`}
      >
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
              onMoveToColumn={handleMoveToColumn}
            />
          ))}
          {taskList.length === 0 && (
            <div className={styles.emptyColumn}>
              {isColumnDropTarget ? 'Drop task here' : 'No tasks'}
            </div>
          )}
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