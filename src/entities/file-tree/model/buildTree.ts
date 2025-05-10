import type { FileNode } from './types';
import { getFileType } from '../../../shared/lib/getFileType';

export const buildTree = (files: { path: string; content: string | ArrayBuffer }[]): FileNode[] => {
  const root: FileNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, idx) => {
      const isLast = idx === parts.length - 1;
      let existing = current.find(n => n.name === part);

      if (!existing) {
        const node: FileNode = {
          id: crypto.randomUUID(),
          name: part,
          path: parts.slice(0, idx + 1).join('/'),
          isDirectory: !isLast,
          isBinary: isLast ? getFileType(part) === 'binary' : false,
          children: !isLast ? [] : undefined,
          content: isLast && typeof file.content === 'string' ? file.content : undefined,
        };
        current.push(node);
        existing = node;
      }

      if (!existing.isDirectory || !existing.children) return;
      current = existing.children;
    });
  }

  return root;
};
