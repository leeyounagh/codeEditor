import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { useMonacoStore } from "../model/monacoStore";
import styled from "styled-components";

const MonacoWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 6
  4px);
  padding: 2rem 0;
`;

export const MonacoEditor = () => {
  const monacoRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { models, activePath } = useMonacoStore();

  useEffect(() => {
    if (monacoRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(monacoRef.current, {
        theme: "vs-dark",
        automaticLayout: true,
      });
    }

    if (editorRef.current && activePath && models[activePath]) {
      editorRef.current.setModel(models[activePath]);
    }
  }, [activePath, models]);

  return <MonacoWrapper ref={monacoRef} />;
};
