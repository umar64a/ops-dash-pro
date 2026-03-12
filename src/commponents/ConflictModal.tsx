import { useState, useEffect } from 'react';
import type { Task } from '../types/Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import type { ConflictChoice } from '../types/ConflictChoice';
import './conflictModal.css';
interface TaskConflictDetail {
  local: Task;
  server: Task;
  resolve: (choice: ConflictChoice) => void;
}
export default function ConflictModal() {
  const [visible, setVisible] = useState(false);
  const [localTask, setLocalTask] = useState<Task | null>(null);
  const [serverTask, setServerTask] = useState<Task | null>(null);
  const [resolveFunc, setResolveFunc] = useState<((choice: ConflictChoice) => void) | null>(null);
  const [manualMergeMode, setManualMergeMode] = useState(false);
  const [mergedFields, setMergedFields] = useState<Partial<Task>>({});
  useEffect(() => {
    const listener = (e: CustomEvent<TaskConflictDetail>) => {
      setLocalTask(e.detail.local);
      setServerTask(e.detail.server);
      setResolveFunc(() => e.detail.resolve);
      setVisible(true);
      setManualMergeMode(false);
      setMergedFields({});
    };
    window.addEventListener('taskConflict', listener as EventListener);
    return () => window.removeEventListener('taskConflict', listener as EventListener);
  }, []);
  if (!visible || !localTask || !serverTask) return null;
  const requiredFields: (keyof Task)[] = ['title', 'description', 'priority', 'status', 'dueDate'];
  const optionalFields: (keyof Task)[] = ['tags', 'attachments'];
  const hasValue = (value: Task[keyof Task] | undefined) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== '';
  };
  const toggleField = (field: keyof Task) => {
    setMergedFields((prev) => {
      const isSelected = prev[field] !== undefined;
      return { ...prev, [field]: isSelected ? undefined : localTask[field] };
    });
  };
  const handleChoice = (choice: 'mine' | 'server' | 'merge') => {
    if (!resolveFunc) return;
    if (choice === 'merge') {
      if (!manualMergeMode) {
        setManualMergeMode(true);
        return;
      } else {
        resolveFunc({ type: 'merge', merged: mergedFields });
      }
    } else {
      resolveFunc({ type: choice });
    }
    setVisible(false);
    setManualMergeMode(false);
    setMergedFields({});
  };
  const handleCancelMerge = () => {
    setManualMergeMode(false);
    setMergedFields({});
  };
  return (
    <div className="conflict-modal-con">
      <div className="conflict-modal">
        <h2>Conflict Detected</h2>
        <div className="conflict-tasks">
          <div className="local-v">
            <h3>Your Version</h3>
            {requiredFields.map((f) => (
              <div className="txt-con" key={f}>
                {manualMergeMode ? (
                  <div className="manual-txt">
                    <input
                      type="checkbox"
                      checked={mergedFields[f] === localTask[f]}
                      onChange={() => toggleField(f)}
                    />
                    <strong>{f}:</strong>
                    <span>{String(localTask[f])}</span>
                  </div>
                ) : (
                  <>
                    <strong>{f}:</strong>
                    <span>{String(localTask[f])}</span>
                  </>
                )}
              </div>
            ))}
            {optionalFields.map((f) => {
              const localValue = localTask[f];
              if (!hasValue(localValue)) return null;
              return (
                <div className="txt-con" key={f}>
                  {manualMergeMode ? (
                    <div className="manual-txt">
                      <input
                        type="checkbox"
                        checked={mergedFields[f] === localTask[f]}
                        onChange={() => toggleField(f)}
                      />
                      <strong>{f}:</strong>
                      <span>
                        {Array.isArray(localValue) ? localValue.join(', ') : localValue?.toString()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <strong>{f}:</strong>
                      <span>
                        {Array.isArray(localValue) ? localValue.join(', ') : localValue?.toString()}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="server-v">
            <h3>Server Version</h3>
            {requiredFields.map((f) => (
              <div key={f}>
                <strong>{f}:</strong>
                <span>{serverTask[f]?.toString() || ''}</span>
              </div>
            ))}
            {optionalFields.map((f) => {
              const serverValue = serverTask[f];
              if (!hasValue(serverValue)) return null;
              return (
                <div key={f}>
                  <strong>{f}:</strong>
                  <span>
                    {Array.isArray(serverValue) ? serverValue.join(', ') : serverValue?.toString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-btns">
          {!manualMergeMode && (
            <>
              <button className="choise" onClick={() => handleChoice('mine')}>
                Keep Mine
              </button>
              <button className="choise" onClick={() => handleChoice('server')}>
                Keep Server
              </button>
              <button className="choise" onClick={() => handleChoice('merge')}>
                Manual Merge
              </button>
            </>
          )}
          {manualMergeMode && (
            <>
              <button className="back" onClick={handleCancelMerge}>
                <FontAwesomeIcon className="back-i" icon={faAngleLeft} />
                Back
              </button>
              <button
                className="choise save"
                onClick={() => handleChoice('merge')}
                disabled={Object.values(mergedFields).every((v) => v === undefined)}
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
