import { TabItem } from "./TabItem";
import { useTabs } from "../model/useTabs";
import styled from "styled-components";

const TabsWrapper = styled.div`
  display: flex;
  padding: 0 1rem;
  padding-left: 0px;
  background-color: #1a1a1a;
  // gap: 20px;
  height: 100%;
`;

export const Tabs = () => {
  const { tabs, closeTab, openTab } = useTabs();


  return (
    <TabsWrapper>
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          onClose={() => closeTab(tab.id)}
          onClick={() => openTab(tab)}
        />
      ))}
    </TabsWrapper>
  );
};
