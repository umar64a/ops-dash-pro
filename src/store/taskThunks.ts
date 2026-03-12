import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../services/db';
import { deleteTaskFromServer } from '../services/syncEngine';
import { v4 as uuid } from 'uuid';
import type { Task } from '../types/Task';
import type { SyncItem } from '../types/sync';
import { addTask, updateTask, deleteTask } from './taskSlice';
import { processSyncQueue } from '../services/syncEngine';
export const addTaskThunk = createAsyncThunk(
  'tasks/addTaskThunk',
  async (task: Task, { dispatch }) => {
    await db.tasks.put(task);
    const item: SyncItem = {
      id: uuid(),
      type: 'TASK_CREATE',
      payload: task,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    await db.syncQueue.put(item);
    dispatch(addTask(task));
    if (navigator.onLine) {
      await processSyncQueue();
    }
  },
);
export const updateTaskThunk = createAsyncThunk(
  'tasks/updateTaskThunk',
  async (task: Task, { dispatch }) => {
    await db.tasks.put(task);
    const item: SyncItem = {
      id: uuid(),
      type: 'TASK_UPDATE',
      payload: task,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    await db.syncQueue.put(item);
    dispatch(updateTask(task));
    if (navigator.onLine) {
      await processSyncQueue();
    }
  },
);
export const deleteTaskThunk = createAsyncThunk(
  'tasks/deleteTaskThunk',
  async (taskId: string, { dispatch }) => {
    dispatch(deleteTask(taskId));
    await db.tasks.delete(taskId);
    const queueItems = await db.syncQueue.toArray();
    for (const item of queueItems) {
      if (item.payload?.id === taskId) {
        await db.syncQueue.delete(item.id);
      }
    }
    deleteTaskFromServer(taskId);
  },
);