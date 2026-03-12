import { useEffect } from 'react';
import { processFileQueue } from '../services/syncEngine';
export const useFileSync = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine) {
        processFileQueue();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
};