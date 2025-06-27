import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addColumn } from '../store/columnsSlice';
import { v4 as uuid } from 'uuid';
import styles from '../styles/AddColumn.module.css';

const AddColumn = () => {
  const dispatch = useAppDispatch();
  const id = uuid();
  const [text, setText] = useState('');

  const handleAddColumn = () => {
    dispatch(addColumn({ id, title: text }));
    setText('');
  }

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New column title"
        className={styles.input}
      />
      <button
        onClick={()=> text.length && handleAddColumn()}
        className={styles.button}
      >
        Add new TODO
      </button>
    </div>
  );
};

export default AddColumn;