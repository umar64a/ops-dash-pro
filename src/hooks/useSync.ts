import { useEffect } from 'react';
import { processSyncQueue, processFileQueue } from '../services/syncEngine';
export const useSync = () => {
  useEffect(() => {
    const sync = async () => {
      await processSyncQueue();
      await processFileQueue();
    };
    window.addEventListener('online', sync);
    if (navigator.onLine) sync();
    return () => window.removeEventListener('online', sync);
  }, []);
};