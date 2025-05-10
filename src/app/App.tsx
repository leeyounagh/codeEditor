import { use, useEffect } from "react";
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

function App() {
  const tree = useFileTreeStore((state) => state.tree);
  const setTree = useFileTreeStore((state) => state.setTree);
  const setSelectedNode = useFileTreeStore((state) => state.setSelectedNode);
  const selectedNode = useFileTreeStore((state) => state.selectedNode);
  const openTab = useFileTreeStore((state) => state.openTab);

  useEffect(() => {
    if (tree.length === 0) {
      setTree(mockTree);

      const firstFile = findFirstFile(mockTree);
      if (firstFile) {
        openTab(firstFile);
      }
    }
  }, [tree, setSelectedNode, setTree, openTab]);

  console.log("Selected Node:", selectedNode);
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
