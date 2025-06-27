import { useAppSelector, useAppDispatch } from './store/hooks';
import { useState } from 'react';
import { reorderColumns } from './store/columnsSlice';
import Column from './components/Column';
import RemoveMarkedTask from './components/RemoveMarkedTasks';
import AddColumn from './components/AddColumn';
import SearchResults from './components/SmartSearch';
import styles from './styles/App.module.css';

const App = () => {
  const columnOrder = useAppSelector(state => state.columns.order);
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();

  const handleReorderColumns = (dragIndex: number, hoverIndex: number) => {
    console.log(dragIndex, hoverIndex)
    dispatch(reorderColumns({
      fromIndex: dragIndex,
      toIndex: hoverIndex
    }));
  };

  return (
    <div className={`${styles.appBackground} ${styles.appContainer}`}>
      <div className={styles.header}>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search tasks..."
          className={styles.searchInput}
        />
        <SearchResults query={searchText} />
      </div>
      <div className={styles.actions}>
        <AddColumn />
        <RemoveMarkedTask />
      </div>
      <div className={styles.columns}>
        {columnOrder.map((id, index) => (
          <Column 
            key={id} 
            columnId={id} 
            index={index}
            onReorderColumns={handleReorderColumns}
          />
        ))}
      </div>
    </div>
  );
};

export default App;