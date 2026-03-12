import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
const selectTasks = (state: RootState) => state.tasks.tasks || [];
const selectProducts = (state: RootState) => state.catalog.products || [];
const selectFiles = (state: RootState) => state.files.files || [];
export const selectTaskStats = createSelector([selectTasks], (tasks) => {
  const done = tasks.filter((t) => t.status === 'done').length;
  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  return {
    total: tasks.length,
    done,
    highPriority,
  };
});
export const selectFileStats = createSelector([selectFiles], (files) => {
  const pendingUploads = files.filter((f) => !f.uploaded).length;
  return {
    totalFiles: files.length,
    pendingUploads,
  };
});
export const selectCatalogStats = createSelector([selectProducts], (products) => {
  const saved = JSON.parse(localStorage.getItem('savedCatalogItems') ?? '[]');
  const savedCount = Array.isArray(saved) ? saved.length : 0;
  return {
    totalProducts: products.length,
    savedCount,
  };
});