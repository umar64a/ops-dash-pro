import { useEffect, useState } from 'react';
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMsg, setShowOnlineMsg] = useState(false);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMsg(true);
      setTimeout(() => setShowOnlineMsg(false), 2000);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return { isOnline, showOnlineMsg };
};