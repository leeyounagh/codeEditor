import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FileNode } from "./types";

//  테스트 환경 여부 확인
const isTestEnv = typeof process !== 'undefined' && process.env.VITEST;

//  storage 정의 위치를 위로 올려 테스트 환경 조건 안에서 처리
const storage = isTestEnv
  ? undefined
  : createJSONStorage<FileTreeState>(() => ({
      getItem: async (name) => {
        const { openDB } = await import("idb");
        const db = await openDB("zustand-db", 1, {
          upgrade(db) {
            db.createObjectStore("store");
          },
        });
        return (await db.get("store", name)) ?? null;
      },
      setItem: async (name, value) => {
        const { openDB } = await import("idb");
        const db = await openDB("zustand-db", 1);
        await db.put("store", value, name);
      },
      removeItem: async (name) => {
        const { openDB } = await import("idb");
        const db = await openDB("zustand-db", 1);
        await db.delete("store", name);
      },
    }));

// 상태 타입 정의
interface FileTreeState {
  tree: FileNode[];
  selectedNode: FileNode | null;
  openedTabs: FileNode[];

  setTree: (tree: FileNode[]) => void;
  setSelectedNode: (node: FileNode | null) => void;
  setOpenedTabs: (tabs: FileNode[]) => void;
  updateFileContent: (path: string, content: string) => void;

  openTab: (node: FileNode) => void;
  closeTab: (nodeId: string) => void;

  addNode: (
    parentPath: string,
    newNode: Omit<FileNode, "children" | "id" | "path">
  ) => void;
  deleteNode: (targetPath: string) => void;
}

// zustand store 생성
export const useFileTreeStore = create<FileTreeState>()(
  persist(
    (set, get) => ({
      tree: [],
      selectedNode: null,
      openedTabs: [],

      setTree: (tree) => set({ tree }),
      setSelectedNode: (node) => set({ selectedNode: node }),
      setOpenedTabs: (tabs) => set({ openedTabs: tabs }),

      updateFileContent: (path, content) => {
        const update = (nodes: FileNode[]): FileNode[] =>
          nodes.map((node) => {
            if (node.path === path && !node.isDirectory) {
              return { ...node, content: content ?? "" };
            } else if (node.children) {
              return { ...node, children: update(node.children) };
            }
            return node;
          });

        set((state) => ({
          tree: update(state.tree),
          openedTabs: state.openedTabs.map((tab) =>
            tab.path === path ? { ...tab, content: content ?? "" } : tab
          ),
          selectedNode:
            state.selectedNode?.path === path
              ? { ...state.selectedNode, content: content ?? "" }
              : state.selectedNode,
        }));
      },

      openTab: (node) =>
        set((state) => {
          const exists = state.openedTabs.find((t) => t.id === node.id);
          if (exists) {
            return {
              openedTabs: state.openedTabs.map((t) => ({
                ...t,
                isActive: t.id === node.id,
              })),
            };
          }
          return {
            openedTabs: [
              ...state.openedTabs.map((t) => ({ ...t, isActive: false })),
              {
                ...node,
                isActive: true,
              },
            ],
          };
        }),

      closeTab: (nodeId) =>
        set((state) => {
          const remainingTabs = state.openedTabs.filter((t) => t.id !== nodeId);
          const closedWasActive = state.openedTabs.find(
            (t) => t.id === nodeId
          )?.isActive;
          const newActive =
            closedWasActive && remainingTabs.length
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
        const updateTree = (nodes: FileNode[]): FileNode[] =>
          nodes.map((node) => {
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
    }),
    {
      name: "file-tree-store",
      storage, 
      // skipHydration: true, 
    }
  )
);
