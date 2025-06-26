import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { selectAllinColumn } from '../store/tasksSlice';
import styles from '../styles/SelectAllInColumn.module.css';
import { ListCollapse } from 'lucide-react';

const SelectAllInColumn = ({ columnId }: { columnId: string }) => {
  const [value, setValue] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = () => {
    setValue(prev => !prev);
    dispatch(selectAllinColumn({ value: !value, columnId }));
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
        <ListCollapse
          className={`${styles.icon} ${value ? styles.checked : styles.unchecked}`}
        />
        <span className={styles.text}>Select all</span>
      </label>
    </div>
  );
};

export default SelectAllInColumn;