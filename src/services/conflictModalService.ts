import type { Task } from '../types/Task';
import type { ConflictChoice } from '../types/ConflictChoice';
export const openConflictModal = (local: Task, server: Task): Promise<ConflictChoice> => {
  return new Promise((resolve) => {
    const modalEvent = new CustomEvent('taskConflict', { detail: { local, server, resolve } });
    window.dispatchEvent(modalEvent);
  });
};