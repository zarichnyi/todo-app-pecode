import { useAppSelector } from './store/hooks';
import { useState } from 'react';
import Column from './components/Column';
import RemoveMarkedTask from './components/RemoveMarkedTasks';
import AddColumn from './components/AddColumn';
import SearchResults from './components/SmartSearch';
import styles from './styles/App.module.css';

const App = () => {
  const columnOrder = useAppSelector(state => state.columns.order);
  const [searchText, setSearchText] = useState('');

  return (
    <div className={styles.appContainer}>
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
        {columnOrder.map(id => (
          <Column key={id} columnId={id} />
        ))}
      </div>
    </div>
  );
};

export default App;