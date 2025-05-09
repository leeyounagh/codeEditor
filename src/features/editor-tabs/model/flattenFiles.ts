import { type FileNode } from "../../../entities/file-tree/model/types";

export const flattenFiles = (nodes: FileNode[]): FileNode[] => {
  let result: FileNode[] = [];
  for (const node of nodes) {
    if (node.isDirectory && node.children) {
      result = result.concat(flattenFiles(node.children));
    } else if (!node.isDirectory) {
      result.push(node);
    }
  }
  return result;
};
