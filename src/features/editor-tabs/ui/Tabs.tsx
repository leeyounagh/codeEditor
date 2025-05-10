import { TabItem } from "./TabItem";
import styled from "styled-components";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";

const TabsWrapper = styled.div`
  display: flex;
  padding: 0 1rem;
  padding-left: 0px;
  background-color: #1a1a1a;
  // gap: 20px;
  height: 100%;
`;

export const Tabs = () => {
  const { openedTabs, openTab, closeTab } = useFileTreeStore();


  return (
    <TabsWrapper>
      {openedTabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={{
            ...tab,
            content: tab.content ?? "",
            isActive: tab.isActive ?? false,
          }}
          onClose={() => closeTab(tab.id)}
          onClick={() => openTab(tab)}
        />
      ))}
    </TabsWrapper>
  );
};
