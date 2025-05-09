import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { useMonacoStore } from '../model/monacoStore';

export const MonacoEditor = () => {
  const monacoRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { models, activePath } = useMonacoStore();

  useEffect(() => {
    if (monacoRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(monacoRef.current, {
        theme: 'vs-dark',
        automaticLayout: true,
      });
    }

    if (editorRef.current && activePath && models[activePath]) {
      editorRef.current.setModel(models[activePath]);
    }
  }, [activePath, models]);

  return <div ref={monacoRef} style={{ width: '100%', height: '100%' }} />;
};
