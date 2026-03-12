export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded: boolean;
  createdAt: string;
  previewUrl?: string;
}