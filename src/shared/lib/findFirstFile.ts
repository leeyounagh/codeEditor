import type { FileNode } from "../../entities/file-tree/model/types";

export function findFirstFile(nodes: FileNode[]): FileNode | null {
  for (const node of nodes) {
    if (!node.isDirectory) return node;
    if (node.children) {
      const found = findFirstFile(node.children);
      if (found) return found;
    }
  }
  return null;
}
