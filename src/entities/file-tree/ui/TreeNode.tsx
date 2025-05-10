import type { FileNode } from "../model/types";
import { useState } from "react";
import styled from "styled-components";
// import { dfs } from "../model/dfs";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import { VscFileCode } from "react-icons/vsc";
import { BsFileEarmarkText } from "react-icons/bs";
import { useFileTreeStore } from "../model/fileTreeStore";

const TreeItem = styled.div<{ indent: number }>`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: ${({ indent }) => `${indent * 1.5}rem`};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  // padding-left: 1.5rem;
  &:hover {
    background-color: #2d2d2d;
    color: white;
  }
`;
const TreeText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
`;
type TreeNodeProps = {
  node: FileNode;
  depth?: number;
};

export const TreeNode = ({ node, depth = 0 }: TreeNodeProps) => {
  const [open, setOpen] = useState(false);
  const { setSelectedNode, openTab } = useFileTreeStore();

  const handleClick = () => {
    setSelectedNode(node);
    if (node.isDirectory) {
      setOpen((prev) => !prev);
    } else {
      console.log("선택한 파일:", node.name);
      openTab(node);
    }
  };

  const renderIcon = () => {
    if (node.isDirectory) {
      return open ? <FaFolderOpen /> : <FaFolder />;
    }

    const ext = node.name.split(".").pop()?.toLowerCase();
    if (!ext) return <FaFile />;

    const codeExt = ["js", "ts", "jsx", "tsx"];
    const textExt = ["md", "txt", "json"];

    if (codeExt.includes(ext)) return <VscFileCode />;
    if (textExt.includes(ext)) return <BsFileEarmarkText />;

    return <FaFile />;
  };

  return (
    <div>
      <TreeItem onClick={handleClick} indent={depth}>
        {renderIcon()}
        <TreeText>{node.name}</TreeText>
      </TreeItem>
      {open &&
        node.children?.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
};
