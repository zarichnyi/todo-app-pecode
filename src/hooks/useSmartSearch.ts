import Fuse from 'fuse.js';
import type { Task } from '../types/types';

export const useSmartSearch = (tasks: Task[], query: string): Task[] => {
  if (!query) return tasks;

  const fuse = new Fuse(tasks, {
    keys: ['text'],
    threshold: 0.4, // 0 = exact match, 1 = all match
  });

  return fuse.search(query).map(result => result.item);
};
