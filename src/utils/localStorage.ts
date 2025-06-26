export const loadState = () => {
  try {
    const serialized = localStorage.getItem('todo-state');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    console.error("LOCAL_STORAGE:", e)
  }
};

export const saveState = (state: any) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('todo-state', serialized);
  } catch (e) {
    console.error("LOCAL_STORAGE:", e)
  }
};