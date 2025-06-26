import { useState } from 'react';
import { useAppDispatch } from '@hooks';
import { markAllAsCompleted } from '../store/tasksSlice';
import styles from '../styles/MarkAsAllTasksCompleted.module.css';
import { ListChecks } from 'lucide-react';

const MarkAsAllTasksCompleted = ({ columnId }: { columnId: string }) => {
  const [value, setValue] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = () => {
    setValue(prev => !prev);
    dispatch(markAllAsCompleted({ value: !value, columnId }));
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
          className={styles.checkbox}
        />
        <ListChecks
          className={`${styles.icon} ${value ? styles.checked : styles.unchecked}`}
        />
        <span className={styles.text}>Mark all as Completed</span>
      </label>
    </div>
  );
};

export default MarkAsAllTasksCompleted;