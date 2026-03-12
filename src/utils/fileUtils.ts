import type { FileItem } from '../types/FileItem';
export const formatSize = (size: number) => {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
};
export function getBaseName(fileName: string) {
  if (fileName.length > 25) {
    return fileName.replace(/\.[^/.]+$/, '').slice(0, 25) + '....';
  }
  return fileName.replace(/\.[^/.]+$/, '');
}
export function getReadableType(file: File | FileItem) {
  if (file.type) {
    return file.type.split('/')[1].toUpperCase();
  }
  return file.name.split('.').pop()?.toUpperCase();
}