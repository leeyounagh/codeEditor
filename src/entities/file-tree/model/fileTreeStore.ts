import { create } from 'zustand';
import type { FileNode } from './types';

interface FileTreeState {
  tree: FileNode[];
  selectedNode: FileNode | null;

  setTree: (tree: FileNode[]) => void;
  setSelectedNode: (node: FileNode | null) => void;

  addNode: (parentPath: string, newNode: Omit<FileNode, 'children' | 'id' | 'path'>) => void;
  deleteNode: (targetPath: string) => void;
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  // 전체 파일 트리
  tree: [],

  // 현재 선택된 파일 또는 폴더
  selectedNode: null,

  // 트리 전체 설정 (zip 업로드 시 사용)
  setTree: (tree) => set({ tree }),

  // 선택된 파일 또는 폴더 설정
  setSelectedNode: (node) => set({ selectedNode: node }),

  // 새 파일/폴더 추가
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

  // 파일/폴더 삭제
  deleteNode: (targetPath) => {
    const filterTree = (nodes: FileNode[]): FileNode[] =>
      nodes
        .filter(node => node.path !== targetPath)
        .map(node =>
          node.children
            ? { ...node, children: filterTree(node.children) }
            : node
        );

    set((state) => ({
      tree: filterTree(state.tree),
      selectedNode:
        state.selectedNode?.path === targetPath ? null : state.selectedNode,
    }));
  },
}));
