import {
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileZipper,
  faFileCode,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
export const iconFor = (type: string) => {
  if (type.startsWith('image/')) return { icon: faFileImage, className: 'icon-image' };
  if (type.includes('pdf')) return { icon: faFilePdf, className: 'icon-pdf' };
  if (type.includes('word')) return { icon: faFileWord, className: 'icon-word' };
  if (type.includes('excel')) return { icon: faFileExcel, className: 'icon-excel' };
  if (type.includes('zip')) return { icon: faFileZipper, className: 'icon-zip' };
  if (
    type.includes('html') ||
    type.includes('javascript') ||
    type.includes('css') ||
    type.includes('ts')
  )
    return {
      icon: faFileCode,
      className: 'icon-code',
    };
  return { icon: faFile, className: 'icon-default' };
};