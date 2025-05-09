// entities/file-tree/model/fileTreeStore.ts
import { create } from 'zustand';
import type { FileNode } from './types';

interface FileTreeState {
  tree: FileNode[];
  activeFile: FileNode | null;

  setTree: (tree: FileNode[]) => void;
  setActiveFile: (file: FileNode | null) => void;

  addNode: (parentPath: string, newNode: Omit<FileNode, 'children' | 'id' | 'path'>) => void;
  deleteNode: (targetPath: string) => void;
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  tree: [],
  activeFile: null,

  setTree: (tree) => set({ tree }),
  setActiveFile: (file) => set({ activeFile: file }),

  addNode: (parentPath, newNode) => {
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.path === parentPath && node.isDirectory) {
          return {
            ...node,
            children: [
              ...(node.children || []),
              {
                ...newNode,
                id: crypto.randomUUID(),
                path: `${node.path}/${newNode.name}`,
                children: newNode.isDirectory ? [] : undefined,
              },
            ],
          };
        } else if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    set({ tree: updateTree(get().tree) });
  },

  deleteNode: (targetPath) => {
    const filterTree = (nodes: FileNode[]): FileNode[] =>
      nodes
        .filter(node => node.path !== targetPath)
        .map(node =>
          node.children
            ? { ...node, children: filterTree(node.children) }
            : node
        );

    set(state => ({
      tree: filterTree(state.tree),
      activeFile: state.activeFile?.path === targetPath ? null : state.activeFile,
    }));
  },
}));
