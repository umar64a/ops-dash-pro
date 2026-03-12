import { useEffect, useState } from 'react';
import { db } from '../services/db';
import type { SyncItem } from '../types/sync';
export function useSyncStatus() {
  const [queueTotal, setQueueTotal] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [pendingFiles, setPendingFiles] = useState(0);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const loadStatus = async () => {
    const queue: SyncItem[] = await db.syncQueue.toArray();
    setQueueTotal(queue.length);
    setPendingTasks(
      queue.filter((item) => item.type === 'TASK_CREATE' || item.type === 'TASK_UPDATE').length,
    );
    setPendingFiles(queue.filter((item) => item.type === 'FILE_UPLOAD').length);
    const last = localStorage.getItem('lastSyncTime');
    if (last) setLastSync(Number(last));
  };
  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  const getLastSyncDisplay = () => {
    if (!lastSync) return '---';
    const diff = Date.now() - lastSync;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (seconds < 60) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    if (hours < 24) {
      return `${hours} hr ago`;
    }
    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    return new Date(lastSync).toLocaleString();
  };
  return {
    queueTotal,
    pendingTasks,
    pendingFiles,
    getLastSyncDisplay,
  };
}