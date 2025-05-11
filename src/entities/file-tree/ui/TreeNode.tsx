import type { FileNode } from "../model/types";
import { useState } from "react";
import styled from "styled-components";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import { VscFileCode } from "react-icons/vsc";
import { BsFileEarmarkText } from "react-icons/bs";
import { useFileTreeStore } from "../model/fileTreeStore";

const TreeItem = styled.div<{ indent: number; isSelected: boolean }>`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: ${({ indent }) => `${Math.max(indent, 1) * 1.5}rem`};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ isSelected }) =>
    isSelected ? "#2a2a2a" : "transparent"};

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
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const { setOpenedTabs, openedTabs } = useFileTreeStore();

  const { setSelectedNode, openTab, selectedNode, setTree, tree } =
    useFileTreeStore();

  const isSelected = selectedNode?.id === node.id;

  const handleClick = () => {
    setSelectedNode(node);
    if (node.isDirectory) {
      setOpen((prev) => !prev);
    } else {
      openTab(node);
    }
  };

  const handleRename = () => {
    const renameInTree = (nodes: FileNode[]): FileNode[] =>
      nodes.map((n) => {
        if (n.id === node.id) {
          return { ...n, name: newName };
        } else if (n.children) {
          return { ...n, children: renameInTree(n.children) };
        }
        return n;
      });

    const updatedTabs = openedTabs.map((tab) => {
      if (tab.id === node.id) {
        return { ...tab, name: newName };
      }
      return tab;
    });

    setTree(renameInTree(tree));
    setOpenedTabs(updatedTabs);
    setIsRenaming(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleRename();
    if (e.key === "Escape") {
      setIsRenaming(false);
      setNewName(node.name);
    }
  };

  const renderIcon = () => {
    if (node.isDirectory) return open ? <FaFolderOpen /> : <FaFolder />;

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
      <TreeItem
        data-testid={`tab-${node.name}`}
        onClick={handleClick}
        indent={depth + 1}
        isSelected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "F2") {
            e.preventDefault();
            setIsRenaming(true);
          }
        }}
      >
        {renderIcon()}
        {isRenaming ? (
          <input
            value={newName}
            autoFocus
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            style={{ fontSize: "0.9rem", flex: 1 }}
          />
        ) : (
          <TreeText>{node.name}</TreeText>
        )}
      </TreeItem>
      {open &&
        node.children?.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
};
