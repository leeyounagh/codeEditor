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

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Main>
          <Sidebar>
            <Header>
              <UploadHandler />
            </Header>
            <FileTree tree={mockTree} />
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
