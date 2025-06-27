import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addTask } from '../store/tasksSlice';
import { addTaskToColumn } from '../store/columnsSlice';
import { v4 as uuid } from 'uuid';
import styles from '../styles/AddTaskModal.module.css';

type Props = {
  columnId: string;
  isOpen: boolean;
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTaskModal: React.FC<Props> = ({ columnId, isOpen, setIsModalActive }) => {
  const [text, setText] = useState<string>('');
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    const id = uuid();
    dispatch(addTask({ id, text, completed: false, column: columnId, marked: false }));
    dispatch(addTaskToColumn({ columnId, taskId: id }));
    setIsModalActive(false);
    setText('');
  };

  return (
    <>
      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.title}>Add Task</h3>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Task name"
              className={styles.input}
            />
            <div className={styles.buttons}>
              <button onClick={()=> text.length && handleAdd()} className={styles.addButton}>Add</button>
              <button
                onClick={() => {
                  setIsModalActive(false);
                  setText('');
                }}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskModal;