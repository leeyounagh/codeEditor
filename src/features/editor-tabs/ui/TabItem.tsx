import type { Tab } from "../model/types";
import styled from "styled-components";
import type { FileNode } from "../../../entities/file-tree/model/types";
import { StyledButton } from "../../../shared";

type Props = {
  tab: Tab & FileNode;
  onClose: () => void;
  onClick: () => void;
};
const TabContainer = styled.div<{ $active: boolean }>`
  padding: 8px 5px 8px 20px;
  background: ${({ $active }) => ($active ? "#1e1e1e" : "#1a1a1a")};
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  height: 100%;
  cursor: pointer;
  // overflow: hidden;
`;

export const TabItem = ({ tab, onClose, onClick }: Props) => {
  return (
    <TabContainer $active={tab.isActive} onClick={onClick}>
      {tab.name}
      <StyledButton
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        x
      </StyledButton>
    </TabContainer>
  );
};
