import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Task } from '../types/Task';
import type { SyncItem } from '../types/sync';
import type { FileItem } from '../types/FileItem';
import type { WeatherItem } from '../types/weather';
import type { Product } from '../types/product';
export class AppDB extends Dexie {
  tasks!: Table<Task, string>;
  files!: Table<FileItem, string>;
  syncQueue!: Table<SyncItem, string>;
  catalogCache!: Table<{ id: string; data: Product[]; cachedAt: number }, string>;
  weatherCache!: Table<{ id: string; data: WeatherItem; cachedAt: number }, string>;
  constructor() {
    super('OpsDashDB');
    this.version(1).stores({
      tasks: 'id, status, priority, updatedAt',
      files: 'id, name, uploaded, createdAt',
      syncQueue: 'id, type, createdAt, retryCount',
      weatherCache: 'id, cachedAt',
      catalogCache: 'id, cachedAt',
    });
  }
}
export const db = new AppDB();