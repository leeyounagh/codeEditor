import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { extensionToLang } from "../model/extensionToLang";
import type { FileNode } from "../../file-tree/model/types";

const MonacoWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  padding: 2rem 0;
`;

type Props = {
  file: FileNode | undefined;
  onChange: (path: string, content: string) => void;
};

export const MonacoEditor = ({ file, onChange }: Props) => {
  const monacoRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const changeListenerRef = useRef<monaco.IDisposable | null>(null); //  변경 감지용

  useEffect(() => {
    if (file) {
      const uri = monaco.Uri.parse(`file:///${file.path}`);
      let existingModel = monaco.editor.getModel(uri);

      if (!existingModel) {
        const ext = file.path.slice(file.path.lastIndexOf("."));
        const language = extensionToLang[ext] || "plaintext";
        existingModel = monaco.editor.createModel(
          file.content || "",
          language,
          uri
        );
      }

      setModel(existingModel);
    }
  }, [file?.path]);

  useEffect(() => {
    if (monacoRef.current && model && !editorRef.current) {
      editorRef.current = monaco.editor.create(monacoRef.current, {
        model,
        theme: "vs-dark",
        automaticLayout: true,
      });
    } else if (editorRef.current && model) {
      editorRef.current.setModel(model);
    }

    //  이전 리스너 제거
    changeListenerRef.current?.dispose();

    //  변경 감지 시 zustand 업데이트
    if (editorRef.current && file && model) {
      changeListenerRef.current = model.onDidChangeContent(() => {
        const updated = model.getValue();
        onChange(file.path, updated);
      });
    }

    return () => {
      changeListenerRef.current?.dispose();
    };
  }, [model, file]);

  return <MonacoWrapper ref={monacoRef} />;
};
