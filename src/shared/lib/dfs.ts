import type { FileNode } from "../../entities/file-tree/model/types";

export const dfs = (node: FileNode, callback: (node: FileNode) => void) => {
  callback(node);

  if (node.isDirectory && node.children) {
    node.children.forEach((child) => dfs(child, callback));
  }
};