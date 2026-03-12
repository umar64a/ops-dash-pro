import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useSyncStatus } from '../hooks/useSyncStatus';
import './settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faArrowsSpin,
  faNetworkWired,
  faGear,
  faClock,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';
export default function Settings() {
  const { isOnline, showOnlineMsg } = useOnlineStatus();
  const { pendingTasks, pendingFiles, getLastSyncDisplay } = useSyncStatus();
  const [connectionType, setConnectionType] = useState<string>('');
  useEffect(() => {
    const connection: NetworkInformation | undefined = navigator.connection;
    const updateConnection = () => {
      if (connection?.effectiveType) {
        setConnectionType(connection.effectiveType);
      }
    };
    updateConnection();
    connection?.addEventListener('change', updateConnection);
    return () => connection?.removeEventListener('change', updateConnection);
  }, []);
  return (
    <div className="settings-body">
      {!isOnline && (
        <div className="net-status">
          <span className="offline">Offline</span>
        </div>
      )}
      {showOnlineMsg && (
        <div className="net-status">
          <span className="online">Back Online</span>
        </div>
      )}
      <h1>
        <FontAwesomeIcon className="set-i" icon={faGear} />
        Settings
      </h1>
      <div className="sec-1">
        <h2>
          <FontAwesomeIcon className="set-i" icon={faGlobe} />
          Network Status
        </h2>
        <span>Status:</span>
        <span className={isOnline ? 'green' : 'red'}>{isOnline ? 'Online' : 'Offline'}</span>
        {connectionType && <span id="c-type">Connection Type: {connectionType.toUpperCase()}</span>}
      </div>
      <div className="sec-2">
        <h2>
          <FontAwesomeIcon className="set-i" icon={faArrowsSpin} />
          Sync Engine Status
        </h2>
        <span>
          <FontAwesomeIcon className="card-i p-i" icon={faHourglassHalf} />
          Pending Tasks: {pendingTasks}
        </span>
        <span>
          <FontAwesomeIcon className="card-i p-i" icon={faHourglassHalf} />
          Pending Files: {pendingFiles}
        </span>
        <span>
          <FontAwesomeIcon className="card-i cl-i" icon={faClock} />
          Last Sync: {getLastSyncDisplay()}
        </span>
      </div>
      <div className="sec-3">
        <h2>
          <FontAwesomeIcon className="set-i" icon={faNetworkWired} />
          OSI Model Mapping
        </h2>
        <div className="osi-table osi-head">
          <strong className="osi-col1">Protocol / Technology</strong>
          <strong className="osi-col2">OSI Layer</strong>
        </div>
        <div className="osi-table">
          <span className="osi-col1">HTTP</span>
          <span className="osi-col2">Application Layer</span>
        </div>
        <div className="osi-table">
          <span className="osi-col1">TCP</span>
          <span className="osi-col2">Transport Layer</span>
        </div>
        <div className="osi-table">
          <span className="osi-col1">IP</span>
          <span className="osi-col2">Network Layer</span>
        </div>
        <div className="osi-table">
          <span className="osi-col1">Wi-Fi / Ethernet</span>
          <span className="osi-col2">Data Link / Physical Layer</span>
        </div>
      </div>
    </div>
  );
}
