import { useSmartSearch } from '../hooks/useSmartSearch';
import { useAppSelector } from '../store/hooks';
import styles from '../styles/SearchResults.module.css';

const SearchResults = ({ query }: { query: string }) => {
  const tasks = useAppSelector(state => Object.values(state.tasks));
  const filtered = useSmartSearch(tasks, query);

  return (
    <>
      <ul className={styles.resultsList}>
        {query && filtered.length > 0 ? (
          filtered.map(task => (
            <li key={task.id} className={styles.resultItem}>
              {task.text} {task.completed && <span className={styles.completedIcon}>✅</span>}
            </li>
          ))
        ) : (
          <li className={styles.noResults}>No results found</li>
        )}
      </ul>
    </>
  );
};

export default SearchResults;