import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { addFile } from '../store/fileSlice';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import type { FileItem } from '../types/FileItem';
import { getBaseName, getReadableType, formatSize } from '../utils/fileUtils';
import { iconFor } from '../utils/filesIconUtils';
import { useDispatch } from 'react-redux';
import { useScrollFade } from '../hooks/useScrollFade';
type PreviewItem = {
  id: string;
  file: File;
  url?: string;
};
export default function FileUploadBox() {
  const { shouldFade, onMouseEnter, onMouseLeave } = useScrollFade(150, 1000);
  const [selected, setSelected] = useState<PreviewItem[]>([]);
  const dispatch = useDispatch();
  const handleSelect = (list: FileList | null) => {
    if (!list) return;
    const newItems: PreviewItem[] = Array.from(list).map((f) => ({
      id: uuid(),
      file: f,
      url: f.type.startsWith('image') ? URL.createObjectURL(f) : undefined,
    }));
    setSelected((prev) => [...prev, ...newItems]);
  };
  const removeSelected = (id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id));
  };
  const handleUpload = async () => {
    for (const item of selected) {
      const f = item.file;
      const file: FileItem = {
        id: uuid(),
        name: f.name,
        size: f.size,
        type: f.type,
        uploaded: false,
        createdAt: new Date().toISOString(),
      };
      dispatch(addFile(file));
    }
    setSelected([]);
  };
  return (
    <div
      id={selected.length > 1 ? 'box' : ''}
      className={`upload-con ${shouldFade && selected.length === 0 ? 'scrolled' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="preview-con">
        <label htmlFor="fileInput">
          <div className="f-drag">
            <div>
              <FontAwesomeIcon className="drag-i" icon={faPlus} />
              <span id="drag-spn">New Upload</span>
              <span className="drag-spn">Drop file here</span>
            </div>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={(e) => handleSelect(e.target.files)}
          />
        </label>
        {selected.length > 0 && (
          <>
            {selected.map((p) => (
              <div className="prev" key={p.id}>
                <button onClick={() => removeSelected(p.id)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <div>
                  {p.url ? (
                    <img src={p.url} />
                  ) : (
                    (() => {
                      const { icon, className } = iconFor(p.file.type);
                      return <FontAwesomeIcon className={`f-i ${className}`} icon={icon} />;
                    })()
                  )}
                  <span>{getBaseName(p.file.name)}</span>
                  <span>{getReadableType(p.file)}</span>
                  <span>{formatSize(p.file.size)}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <button className="upload-btn" disabled={selected.length === 0} onClick={handleUpload}>
        <FontAwesomeIcon icon={faUpload} /> Upload
      </button>
    </div>
  );
}
