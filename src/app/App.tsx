import { useEffect, useState } from "react";
import { GlobalStyle } from "../shared";
import { FileTree } from "../entities/file-tree";
import { MonacoEditor } from "../entities";
import { UploadHandler } from "../features";
import { Tabs } from "../features";
import {
  AppContainer,
  Header,
  TabArea,
  Main,
  Sidebar,
  EditorArea,
  PreviewImage
} from "./styles/appLyaout";
import { useFileTreeStore } from "../entities/file-tree/model/fileTreeStore";
import { findFirstFile } from "../shared";
import { mockTree } from "../mock/mockTree";
import { dfsWithBinaryCheck } from "../shared";

export function App() {
const {
  tree,
  setTree,
  openTab,
  openedTabs,
  updateFileContent,
} = useFileTreeStore();
  const activeTab = openedTabs.find((t) => t.isActive);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (tree.length === 0) {
      // 트리가 비어있을 때 mockTree로 초기화
      setTree(mockTree);
      const firstFile = findFirstFile(mockTree);
      if (firstFile) {
        openTab(firstFile);
      }
    } else {
      // 트리가 비어있지 않을 때 dfsWithBinaryCheck 호출
      tree.forEach((node) => dfsWithBinaryCheck(node));
    }
  }, [tree, setTree, openTab]);

  // binary 이미지 파일이면 src 생성 (data URL 처리)
  useEffect(() => {
    if (activeTab?.isBinary && activeTab.content) {
      const content = activeTab.content;
      const isDataUrl = content.startsWith("data:");
      const isImageDataUrl = /^data:image\//.test(content);

      if (isDataUrl && !isImageDataUrl) {
        const base64Index = content.indexOf("base64,");
        if (base64Index !== -1) {
          const base64 = content.slice(base64Index + 7);
          setImageSrc(`data:image/png;base64,${base64}`);
        } else {
          setImageSrc(null);
        }
      } else {
        setImageSrc(content);
      }
    } else {
      setImageSrc(null);
    }
  }, [activeTab]);


  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Main>
          <Sidebar>
            <Header>
              <UploadHandler />
            </Header>
            <FileTree tree={tree} />
          </Sidebar>
          <EditorArea>
            <TabArea>
              <Tabs />
            </TabArea>

            {activeTab?.isBinary ? (
              imageSrc ? (
                <PreviewImage
                  src={imageSrc}
                  alt={activeTab.name}
                />
              ) : (
                <p style={{ padding: "1rem", color: "white" }}>
                  이미지를 불러오는 중...
                </p>
              )
            ) : (
              <MonacoEditor file={activeTab} onChange={updateFileContent} />
            )}
          </EditorArea>
        </Main>
      </AppContainer>
    </>
  );
}


