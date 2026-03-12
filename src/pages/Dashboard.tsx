import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { selectTaskStats, selectFileStats, selectCatalogStats } from '../store/dashboardSelectors';
import { setTasks } from '../store/taskSlice';
import { setFiles } from '../store/fileSlice';
import { fetchProducts } from '../store/catalogSlice';
import { db } from '../services/db';
import { useWeatherLocation } from '../hooks/useWeatherLocation';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faHourglassHalf,
  faArrowUp,
  faHeart,
  faClipboardList,
  faFolderClosed,
  faStore,
  faCloudSun,
  faArrowsSpin,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
export default function Dashboard() {
  const dispatch = useAppDispatch();
  useWeatherLocation();
  const taskStats = useAppSelector(selectTaskStats);
  const fileStats = useAppSelector(selectFileStats);
  const catalogStats = useAppSelector(selectCatalogStats);
  const weather = useAppSelector((state) => state.weather.data);
  const error = useAppSelector((state) => state.weather.error);
  const weatherLoading = useAppSelector((state) => state.weather.loading);
  const isOfflineWeather = weather?.isCached ?? false;
  const online = navigator.onLine;
  const { queueTotal, getLastSyncDisplay } = useSyncStatus();
  const { isOnline, showOnlineMsg } = useOnlineStatus();
  useEffect(() => {
    const loadData = async () => {
      const [tasks, files] = await Promise.all([db.tasks.toArray(), db.files.toArray()]);
      dispatch(setTasks(tasks));
      dispatch(setFiles(files));
      dispatch(fetchProducts());
    };
    loadData();
  }, [dispatch]);
  return (
    <div className="dashboard-body">
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
      <h1>Summary widgets</h1>
      <div className="summary-cards">
        <div className="card">
          <div className="card-head">
            <FontAwesomeIcon className="head-i" icon={faClipboardList} />
            <h2>Tasks</h2>
          </div>
          <div>
            <span className="card-spn">Total Tasks: {taskStats.total}</span>
            <span className="card-spn">
              <FontAwesomeIcon className="card-i d-i" icon={faCircleCheck} />
              Done: {taskStats.done}
            </span>
            <span>
              <FontAwesomeIcon className="card-i hp-i" icon={faArrowUp} />
              High Priority: {taskStats.highPriority}
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <FontAwesomeIcon className="head-i" icon={faFolderClosed} />
            <h2>Files</h2>
          </div>
          <div>
            <span className="card-spn">Total Files: {fileStats.totalFiles}</span>
            <span>
              <FontAwesomeIcon className="card-i p-i" icon={faHourglassHalf} />
              Pending Uploads: {fileStats.pendingUploads}
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <FontAwesomeIcon className="head-i" icon={faStore} />
            <h2>Catalog</h2>
          </div>
          <div>
            <span className="card-spn">Total Products: {catalogStats.totalProducts}</span>
            <span>
              <FontAwesomeIcon className="card-i h-i" icon={faHeart} />
              Favorites: {catalogStats.savedCount}
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <FontAwesomeIcon className="head-i" icon={faCloudSun} />
            <h2>Weather</h2>
          </div>
          <div>
            {isOfflineWeather && <span className="card-spn">Offline Data</span>}
            {weatherLoading && !weather && <span>Loading...</span>}
            {!weather && !weatherLoading && !error && <span>Weather not found!</span>}
            {error && !weather && <span id='err'>{error}</span>}
            {weather && (
              <>
                <span className="card-spn city">{weather.location}</span>
                <span className="card-temp">
                  {weather.temperature}°{weather.unit}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <FontAwesomeIcon className="head-i" icon={faArrowsSpin} />
            <h2>Sync Status</h2>
          </div>
          <div>
            <span className={`card-spn ${online ? 'green' : 'red'}`}>
              {online ? 'Online' : 'Offline'}
            </span>
            <span className="card-spn">
              <FontAwesomeIcon className="card-i p-i" icon={faHourglassHalf} />
              Queue: {queueTotal} pending
            </span>
            <span>
              <FontAwesomeIcon className="card-i cl-i" icon={faClock} />
              Last sync: {getLastSyncDisplay()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
