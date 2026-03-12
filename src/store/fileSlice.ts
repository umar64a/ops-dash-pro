import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { db } from '../services/db';
import type { FileItem } from '../types/FileItem';
import { v4 as uuid } from 'uuid';
interface State {
  files: FileItem[];
}
const initialState: State = { files: [] };
const slice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<FileItem>) => {
      state.files.push(action.payload);
      db.files.put(action.payload);
      db.syncQueue.put({
        id: uuid(),
        type: 'FILE_UPLOAD',
        payload: action.payload,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      });
    },
    updateFile: (state, action: PayloadAction<FileItem>) => {
      const i = state.files.findIndex((f) => f.id === action.payload.id);
      if (i !== -1) state.files[i] = action.payload;
      db.files.put(action.payload);
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((f) => f.id !== action.payload);
      db.files.delete(action.payload);
    },
  },
});
export const { setFiles, addFile, updateFile, deleteFile } = slice.actions;
export default slice.reducer;