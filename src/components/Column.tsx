import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { reorderTasksInColumn, moveTaskToColumn } from '../store/columnsSlice';
import { updateTaskColumn } from '../store/tasksSlice';
import TaskComponent from './Task';
import AddTaskModal from './AddTaskModal';
import RemoveColumnWithTasks from './RemoveColumnWithTasks';
import MarkAsAllTasksCompleted from './MarkAsAllTasksCompleted';
import SelectAllInColumn from './SelectAllInColumn';
import styles from '../styles/Column.module.css';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { GripVertical } from 'lucide-react';

type ColumnProps = {
  columnId: string;
  index: number;
  onReorderColumns: (dragIndex: number, hoverIndex: number) => void;
};

const COMPLETED = "completed";
const INCOMPLETED = "incompleted";
const NONE = "none";

const Column: React.FC<ColumnProps> = ({ columnId, index, onReorderColumns }) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<string>(NONE);
  const [isColumnDropTarget, setIsColumnDropTarget] = useState(false);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [isColumnReorderTarget, setIsColumnReorderTarget] = useState(false);
  
  const dispatch = useAppDispatch();
  const column = useAppSelector(state => state.columns.entities[columnId]);
  const tasks = useAppSelector(state => state.tasks);
  const columnRef = useRef<HTMLDivElement>(null);
  const columnDragHandleRef = useRef<HTMLDivElement>(null);
  const columnContainerRef = useRef<HTMLDivElement>(null);

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

  // Set up column drag and drop functionality
  useEffect(() => {
    const element = columnRef.current;
    const dragHandle = columnDragHandleRef.current;
    const containerElement = columnContainerRef.current;
    
    if (!element || !dragHandle || !containerElement) return;

    // Set up column draggable
    const cleanupColumnDraggable = draggable({
      element: dragHandle,
      getInitialData: () => ({ 
        columnId, 
        index,
        type: 'column-reorder' 
      }),
      onDragStart: () => setIsDraggingColumn(true),
      onDrop: () => setIsDraggingColumn(false),
    });

    // Set up column drop target for reordering on the container
    const cleanupColumnDropTarget = dropTargetForElements({
      element: containerElement,
      getData: () => ({ 
        columnId, 
        index,
        type: 'column-reorder' 
      }),
      onDragEnter: ({ source }) => {
        if (source.data.type === 'column-reorder' && source.data.columnId !== columnId) {
          setIsColumnReorderTarget(true);
        }
      },
      onDragLeave: () => setIsColumnReorderTarget(false),
      onDrop: ({ source }) => {
        setIsColumnReorderTarget(false);
        
        if (source.data.type === 'column-reorder' && 
            source.data.columnId !== columnId &&
            typeof source.data.index === 'number') {
          onReorderColumns(source.data.index as number, index);
        }
      },
      canDrop: ({ source }) => {
        return source.data.type === 'column-reorder' && source.data.columnId !== columnId;
      },
    });

    // Set up task drop target (existing functionality) on the inner column element
    const cleanupTaskDropTarget = dropTargetForElements({
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
      onDragLeave: ({ source }) => {
        if (source.data.type === 'task') {
          setIsColumnDropTarget(false);
        }
      },
      onDrop: ({ source }) => {
        if (source.data.type === 'task') {
          setIsColumnDropTarget(false);
          
          if (source.data.columnId === columnId) {
            return;
          }

          // Move task to end of this column
          handleMoveToColumn(
            source.data.taskId as string,
            source.data.columnId as string,
            columnId,
            column.taskIds.length // Add to end
          );
        }
      },
      canDrop: ({ source }) => {
        return source.data.type === 'task' && source.data.columnId !== columnId;
      },
    });

    return () => {
      cleanupColumnDraggable();
      cleanupColumnDropTarget();
      cleanupTaskDropTarget();
    };
  }, [columnId, index, column.taskIds.length, onReorderColumns]);

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
    dispatch(moveTaskToColumn({ taskId, sourceColumnId, targetColumnId, targetIndex }));
    dispatch(updateTaskColumn({ taskId, columnId: targetColumnId }));
  };

  return (
    <div 
      ref={columnContainerRef}
      className={`${styles.columnContainer} ${isColumnReorderTarget ? styles.columnReorderTarget : ''}`}
    >
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
        className={`${styles.column} 
          ${isColumnDropTarget ? styles.columnDropTarget : ''} 
          ${isDraggingColumn ? styles.draggingColumn : ''}`}
      >
        <div className={styles.columnTitleWrapper}>
          <div 
            ref={columnDragHandleRef}
            className={styles.columnDragHandle}
            title="Drag to reorder column"
          >
            <GripVertical size={16} />
          </div>
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
        {/* {filterBy !== NONE && (
          <div className={styles.filterNotice}>
            Drag and drop is disabled when filtering tasks
          </div>
        )} */}
        <div className={styles.taskList}>
          {taskList.map((task, taskIndex) => (
            <TaskComponent 
              key={task.id} 
              task={task} 
              columnId={columnId}
              index={taskIndex}
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