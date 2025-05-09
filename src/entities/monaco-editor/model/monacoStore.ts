import { create } from 'zustand';
import * as monaco from 'monaco-editor';

interface MonacoState {
  models: Record<string, monaco.editor.ITextModel>;
  activePath: string | null;

  setActivePath: (path: string) => void;
  registerModel: (path: string, model: monaco.editor.ITextModel) => void;
}

export const useMonacoStore = create<MonacoState>((set) => ({
  models: {},
  activePath: null,

  setActivePath: (path) => set({ activePath: path }),
  registerModel: (path, model) =>
    set((state) => ({ models: { ...state.models, [path]: model } })),
}));
