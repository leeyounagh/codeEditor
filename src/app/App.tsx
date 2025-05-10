import { useEffect } from "react";
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
} from "./styles/appLyaout";
import { useFileTreeStore } from "../entities/file-tree/model/fileTreeStore";
import { findFirstFile } from "../shared";
import { mockTree } from "../mock/mockTree";
import { dfsWithBinaryCheck } from "../shared";

function App() {
  const tree = useFileTreeStore((state) => state.tree);
  const setTree = useFileTreeStore((state) => state.setTree);
  const selectedNode = useFileTreeStore((state) => state.selectedNode);
  const openTab = useFileTreeStore((state) => state.openTab);

  useEffect(() => {
    if (tree.length === 0) {
      // mockTree 그대로 사용 (isBinary 분석 안 함)
      setTree(mockTree);

      const firstFile = findFirstFile(mockTree);
      if (firstFile) {
        openTab(firstFile);
      }
    } else {
      //mockTree 외 zip 업로드 등에서 트리 변경된 경우만 isBinary인지 판별별
      tree.forEach((node) => dfsWithBinaryCheck(node));
    }
  }, [tree, setTree, openTab]);

  console.log("Selected Node:", selectedNode);
  console.log("File Tree:", tree);
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
            <MonacoEditor />
          </EditorArea>
        </Main>
      </AppContainer>
    </>
  );
}

export default App;
