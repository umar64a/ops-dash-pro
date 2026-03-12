import { db } from './db';
import type { Task } from '../types/Task';
import type { FileItem } from '../types/FileItem';
import { store } from '../store';
import { setTaskDirectly } from '../store/taskSlice';
import { updateFile } from '../store/fileSlice';
import { openConflictModal } from '../services/conflictModalService';
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const serverTasks: Task[] = [];
const serverFiles: FileItem[] = [];
export const processSyncQueue = async () => {
  if (!navigator.onLine) return;
  const queue = await db.syncQueue.where('type').anyOf('TASK_CREATE', 'TASK_UPDATE').toArray();
  for (const item of queue) {
    try {
      const localTask = item.payload as Task;
      let serverTask = serverTasks.find((t) => t.id === localTask.id);
      let finalTask: Task;
      if (serverTask) {
        if (new Date(serverTask.updatedAt) > new Date(localTask.updatedAt)) {
          const choice = await openConflictModal(localTask, serverTask);
          if (choice.type === 'mine') {
            finalTask = { ...localTask };
          } else if (choice.type === 'server') {
            finalTask = { ...serverTask };
          } else if (choice.type === 'merge' && choice.merged) {
            finalTask = {
              ...serverTask,
              ...choice.merged,
            };
          } else {
            finalTask = { ...serverTask };
          }
        } else {
          finalTask = { ...localTask };
        }
        const index = serverTasks.findIndex((t) => t.id === finalTask.id);
        if (index !== -1) {
          serverTasks[index] = { ...finalTask };
        }
      } else {
        finalTask = { ...localTask };
        serverTasks.push({ ...finalTask });
      }
      await db.tasks.put(finalTask);
      store.dispatch(setTaskDirectly(finalTask));
      await db.syncQueue.delete(item.id);
      localStorage.setItem('lastSyncTime', Date.now().toString());
    } catch (err) {
      const nextRetry = (item.retryCount || 0) + 1;
      if (nextRetry > 5) {
        await db.syncQueue.delete(item.id);
        continue;
      }
      await db.syncQueue.update(item.id, { retryCount: nextRetry });
      setTimeout(() => processSyncQueue(), 500 * Math.pow(2, nextRetry));
    }
  }
};
export const deleteTaskFromServer = (id: string) => {
  const index = serverTasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    serverTasks.splice(index, 1);
  }
};
export const processFileQueue = async () => {
  const queue = await db.syncQueue.where('type').equals('FILE_UPLOAD').toArray();
  for (const item of queue) {
    const file = item.payload as FileItem;
    try {
      if (!navigator.onLine) throw new Error('Offline');
      await delay(200);
      const uploadedFile: FileItem = {
        ...file,
        uploaded: true,
      };
      await db.files.put(uploadedFile);
      store.dispatch(updateFile(uploadedFile));
      serverFiles.push(uploadedFile);
      console.log('Server files now:', serverFiles);
      await db.syncQueue.delete(item.id);
      localStorage.setItem('lastSyncTime', Date.now().toString());
    } catch {
      const baseDelay = 500;
      const nextRetry = (item.retryCount || 0) + 1;
      if (nextRetry > 5) {
        await db.syncQueue.delete(item.id);
        continue;
      }
      const backoff = baseDelay * Math.pow(2, nextRetry);
      await db.syncQueue.update(item.id, {
        retryCount: nextRetry,
      });
      setTimeout(processFileQueue, backoff);
    }
  }
};
export const deleteFileFromServer = (id: string) => {
  const index = serverFiles.findIndex((f) => f.id === id);
  if (index !== -1) {
    serverFiles.splice(index, 1);
  }
};
export const initializeServerData = async () => {
  const tasks = await db.tasks.toArray();
  serverTasks.splice(0, serverTasks.length, ...tasks);
  const files = await db.files.toArray();
  serverFiles.splice(0, serverFiles.length, ...files);
};