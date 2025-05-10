import { create } from "zustand";
import type { FileNode } from "./types";

interface FileTreeState {
  tree: FileNode[];
  selectedNode: FileNode | null;
  openedTabs: FileNode[];

  setTree: (tree: FileNode[]) => void;
  setSelectedNode: (node: FileNode | null) => void;

  openTab: (node: FileNode) => void;
  closeTab: (nodeId: string) => void;

  addNode: (
    parentPath: string,
    newNode: Omit<FileNode, "children" | "id" | "path">
  ) => void;
  deleteNode: (targetPath: string) => void;
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  tree: [],
  selectedNode: null,
  openedTabs: [],

  setTree: (tree) => set({ tree }),

  setSelectedNode: (node) => set({ selectedNode: node }),

  openTab: (node) =>
    set((state) => {
      const exists = state.openedTabs.find((t) => t.id === node.id);
      if (exists) {
        // 이미 열려 있는 경우 → 해당 탭만 active 처리
        return {
          openedTabs: state.openedTabs.map((t) => ({
            ...t,
            isActive: t.id === node.id,
          })),
        };
      }

      // 새로 탭 열기
      return {
        openedTabs: [
          ...state.openedTabs.map((t) => ({ ...t, isActive: false })),
          { ...node, isActive: true },
        ],
      };
    }),

  closeTab: (nodeId) =>
    set((state) => {
      const remainingTabs = state.openedTabs.filter((t) => t.id !== nodeId);

      // 마지막 닫힌 탭 이전 것을 active로 만들기
      const newActive =
        state.openedTabs.find((t) => t.id === nodeId)?.isActive && remainingTabs.length
          ? remainingTabs[remainingTabs.length - 1]
          : null;

      return {
        openedTabs: remainingTabs.map((t) => ({
          ...t,
          isActive: t.id === newActive?.id,
        })),
      };
    }),

  addNode: (parentPath, newNode) => {
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
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
        .filter((node) => node.path !== targetPath)
        .map((node) =>
          node.children
            ? { ...node, children: filterTree(node.children) }
            : node
        );

    set((state) => ({
      tree: filterTree(state.tree),
      selectedNode:
        state.selectedNode?.path === targetPath ? null : state.selectedNode,
      openedTabs: state.openedTabs.filter((tab) => tab.path !== targetPath),
    }));
  },
}));
