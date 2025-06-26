import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@hooks';
import { removeTask, toggleTaskCompleted, toggleTaskMark, editTask } from '../store/tasksSlice';
import { removeTaskFromColumn } from '../store/columnsSlice';
import type { Task } from '../types/types';
import styles from '../styles/Task.module.css';
import { Trash2, GripVertical } from 'lucide-react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type TaskProps = {
  task: Task;
  columnId: string;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
};

const Task: React.FC<TaskProps> = ({ task, columnId, index, onReorder }) => {
  const dispatch = useAppDispatch();
  const [taskText, setTaskText] = useState(task.text);
  const [editActivated, setEditActivated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  
  const elementRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    const dragHandle = dragHandleRef.current;
    
    if (!element || !dragHandle) return;

    // Set up draggable
    const cleanupDraggable = draggable({
      element: dragHandle,
      getInitialData: () => ({ taskId: task.id, index, columnId }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    // Set up drop target
    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: () => ({ taskId: task.id, index, columnId }),
      onDragEnter: () => setIsDropTarget(true),
      onDragLeave: () => setIsDropTarget(false),
      onDrop: ({ source }) => {
        setIsDropTarget(false);
        const sourceData = source.data;
        if (
          sourceData.columnId === columnId &&
          sourceData.index !== index &&
          typeof sourceData.index === 'number'
        ) {
          onReorder(sourceData.index as number, index);
        }
      },
      canDrop: ({ source }) => {
        return source.data.columnId === columnId && source.data.taskId !== task.id;
      },
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [task.id, index, columnId, onReorder]);

  const handleDelete = () => {
    dispatch(removeTask(task.id));
    dispatch(removeTaskFromColumn({ taskId: task.id, columnId }));
  };

  const handleSubmitEdit = () => {
    dispatch(editTask({ id: task.id, text: taskText }));
    setEditActivated(false);
  };

  return (
    <div 
      ref={elementRef}
      className={`${styles.taskContainer} ${isDragging ? styles.dragging : ''} ${isDropTarget ? styles.dropTarget : ''}`}
    >
      <div className={styles.taskHeaderWrapper}>
        <div className={styles.taskHeader}>
          <div 
            ref={dragHandleRef}
            className={styles.dragHandle}
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </div>
          <div className={styles.checkboxGroup}>
            <input
              aria-label="marked"
              type="checkbox"
              checked={task.marked}
              onChange={() => dispatch(toggleTaskMark(task.id))}
              className={styles.checkbox}
            />
          </div>
          <div>
            <p className={`${styles.taskText} ${task.completed ? styles.taskTextCompleted : ''}`}>
              {task.text}
            </p>
          </div>
        </div>
        <button
          onClick={() => setEditActivated(true)}
          className={styles.editButton}
        >
          Edit
        </button>
      </div>
      <div className={styles.editSection}>
        {editActivated && (
          <div className={styles.editForm}>
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className={styles.editInput}
            />
            <button
              onClick={handleSubmitEdit}
              className={styles.submitButton}
            >
              Submit
            </button>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.checkboxGroup}>
          <p className={styles.label}>Completed?</p>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => dispatch(toggleTaskCompleted(task.id))}
            className={styles.checkbox}
          />
        </div>
        <button
          onClick={handleDelete}
          className={styles.deleteButton}
        >
           <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default Task;