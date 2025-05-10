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
import { mockTree } from "../mock/mockTree";
import { useFileTreeStore } from "../entities/file-tree/model/fileTreeStore";


function App() {
   const tree = useFileTreeStore((state) => state.tree);

   useEffect(() => {
    console.log("업데이트된 tree 상태:", tree);
  }, [tree]);
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
