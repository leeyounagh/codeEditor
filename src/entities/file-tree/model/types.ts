export type FileNode = {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  content?: string;
  isBinary?: boolean;
  children?: FileNode[];
};