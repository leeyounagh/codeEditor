import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { extensionToLang } from "../model/extensionToLang";
import type { FileNode } from "../../file-tree/model/types";

// 반응형 대응을 위한 스타일 수정
const MonacoWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

type Props = {
  file: FileNode | undefined;
  onChange: (path: string, content: string) => void;
};

export const MonacoEditor = ({ file, onChange }: Props) => {
  const monacoRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const changeListenerRef = useRef<monaco.IDisposable | null>(null);

  // 파일 변경 시 model 갱신
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

  // editor 생성 및 model 설정
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

    // 기존 변경 리스너 제거
    changeListenerRef.current?.dispose();

    // 새로운 변경 리스너 설정
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

  // ResizeObserver로 반응형 대응
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const observer = new ResizeObserver(() => {
      editorRef.current?.layout();
    });

    observer.observe(monacoRef.current);

    return () => observer.disconnect();
  }, []);

  return <MonacoWrapper ref={monacoRef} />;
};
