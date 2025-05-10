import type { FileNode } from "../../entities/file-tree/model/types";
import { getFileType } from "./getFileType";

export const dfsWithBinaryCheck = (
  node: FileNode,
  callback?: (node: FileNode) => void
) => {
  if (!node.isDirectory) {
    node.isBinary = getFileType(node.name) === "binary" ? true : false;
  }

  if (callback) callback(node);

  if (node.isDirectory && node.children) {
    node.children.forEach((child) => dfsWithBinaryCheck(child, callback));
  }
};
