import type { Task } from './Task';
export interface ConflictChoice {
  type: 'mine' | 'server' | 'merge';
  merged?: Partial<Task>;
}