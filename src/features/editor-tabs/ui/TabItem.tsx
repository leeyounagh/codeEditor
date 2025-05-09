import type { Tab } from "../model/types";
import styled from "styled-components";

type Props = {
  tab: Tab;
  onClose: () => void;
  onClick: () => void;
};
const TabContainer = styled.div<{ $active: boolean }>`
  padding: 8px 12px;
  background: ${({ $active }) => ($active ? "#1e1e1e" : "#1a1a1a")};
  // border: ${({ $active }) => ($active ? "1px solid #ccc" : "none")};
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: 100%;
  cursor: pointer;
`;
export const TabItem = ({ tab, onClose, onClick }: Props) => {
  return (
    <TabContainer $active={tab.isActive} onClick={onClick}>
      {tab.name}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onClose();
        }}
        style={{ marginLeft: 8, color: "lightgray" }}
      >
        x
      </button>
    </TabContainer>
  );
};
