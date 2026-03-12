import type { Task } from "./Task";
import type { FileItem } from "./FileItem";
export interface SyncItem {
  id: string;
  type: "TASK_CREATE" | "TASK_UPDATE" | "FILE_UPLOAD";
  payload: Task | FileItem;
  createdAt: string;
  retryCount: number;
}