export type FileNode = {
    id: string;
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileNode[];
    isBinary: boolean;
    content?: string; // editable일 경우
  };