import React, { useState } from 'react';
import { useAppDispatch } from '@hooks';
import { removeTask, toggleTaskCompleted, toggleTaskMark, editTask } from '../store/tasksSlice';
import { removeTaskFromColumn } from '../store/columnsSlice';
import type { Task } from '../types/types';
import styles from '../styles/Task.module.css';
import { Trash2 } from 'lucide-react';

type TaskProps = {
  task: Task;
  columnId: string;
};

const Task: React.FC<TaskProps> = ({ task, columnId }) => {
  const dispatch = useAppDispatch();
  const [taskText, setTaskText] = useState(task.text);
  const [editActivated, setEditActivated] = useState(false);

  const handleDelete = () => {
    dispatch(removeTask(task.id));
    dispatch(removeTaskFromColumn({ taskId: task.id, columnId }));
  };

  const handleSubmitEdit = () => {
    dispatch(editTask({ id: task.id, text: taskText }));
    setEditActivated(false);
  };

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskHeaderWrapper}>
        <div className={styles.taskHeader}>
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