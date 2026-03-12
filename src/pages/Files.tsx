import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../services/db';
import type { RootState } from '../store';
import { setFiles, deleteFile } from '../store/fileSlice';
import { deleteFileFromServer } from '../services/syncEngine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconFor } from '../utils/filesIconUtils';
import { getBaseName, getReadableType, formatSize } from '../utils/fileUtils';
import FileUploadBox from '../commponents/FileUploadBox';
import { faTrashCan, faHourglassHalf, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './files.css';
export default function Files() {
  const dispatch = useDispatch();
  const { isOnline, showOnlineMsg } = useOnlineStatus();
  const [loading, setLoading] = useState(true);
  const files = useSelector((s: RootState) => s.files.files);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await db.files.toArray();
      dispatch(setFiles(data));
      setLoading(false);
    };
    load();
  }, [dispatch]);
  const sortedFiles = useMemo(() => {
    return [...files].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [files]);
  return (
    <div className="file-body">
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
      <h1>File Management</h1>
      <FileUploadBox />
      <div className="file h-f">
        <span className="name">Name</span>
        <span className="size">Size</span>
        <span className="type">Type</span>
        <span className="status">Status</span>
        <span>Actions </span>
      </div>
      {sortedFiles.length === 0 && !loading ? (
        <div className="emt">
          <span>No files uploaded</span>
        </div>
      ) : (
        <>
          {loading && sortedFiles.length === 0 && (
            <div className="f-load">
              <span>Loading...</span>
            </div>
          )}
          {sortedFiles.map((f) => (
            <div className="file" key={f.id}>
              <div className="name">
                {(() => {
                  const { icon, className } = iconFor(f.type);
                  return (
                    <div>
                      <FontAwesomeIcon className={`f-icon ${className}`} icon={icon} />
                    </div>
                  );
                })()}
                <span id="small-name">{getBaseName(f.name)}</span>
                <span id="big-name">
                  {f.name.length > 25 ? f.name.slice(0, 25).toUpperCase() + '....' : f.name}
                </span>
              </div>
              <span className="size">{formatSize(f.size)}</span>
              <span className="type">{getReadableType(f)}</span>
              <span
                id="big-status"
                className="status"
                style={{
                  color: f.uploaded ? 'green' : 'orange',
                }}
              >
                {f.uploaded ? 'Uploaded' : 'Pending'}{' '}
                {f.uploaded ? (
                  <FontAwesomeIcon icon={faCircleCheck} />
                ) : (
                  <FontAwesomeIcon icon={faHourglassHalf} />
                )}
              </span>
              <span
                id="small-status"
                className="status"
                style={{
                  color: f.uploaded ? 'green' : 'orange',
                }}
              >
                {f.uploaded ? (
                  <FontAwesomeIcon icon={faCircleCheck} />
                ) : (
                  <FontAwesomeIcon icon={faHourglassHalf} />
                )}
              </span>
              <div className="act">
                <button
                  onClick={() => {
                    dispatch(deleteFile(f.id));
                    deleteFileFromServer(f.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
