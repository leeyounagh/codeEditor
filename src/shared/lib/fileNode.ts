import JSZip from "jszip";
import type { FileNode } from "../../entities/file-tree/model/types";

export async function parseZipToFileTree(zipFile: File): Promise<FileNode[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const root: FileNode[] = [];
  const fileMap = new Map<string, FileNode>();


  for (const [filePath, file] of Object.entries(zip.files)) {
    const parts = filePath.split("/").filter(Boolean); // 빈 문자열 제거
    const name = parts[parts.length - 1];
    const isDirectory = file.dir;

    const node: FileNode = {
      id: crypto.randomUUID(),
      name,
      path: filePath,
      isDirectory,
      children: isDirectory ? [] : undefined,
      content: isDirectory ? undefined : (await file.async("string")),
    };

    fileMap.set(filePath, node);

    // 부모 경로 결정
    if (parts.length === 1) {
      // 루트 노드
      root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join("/") + "/";
      let parent = fileMap.get(parentPath);

      // ✅ 중간 디렉토리 자동 생성
      if (!parent) {
        parent = {
          id: crypto.randomUUID(),
          name: parts[parts.length - 2],
          path: parentPath,
          isDirectory: true,
          children: [],
        };
        fileMap.set(parentPath, parent);

        // 최상위면 루트에 넣음
        if (parts.length === 2) {
          root.push(parent);
        } else {
          const grandParentPath = parts.slice(0, -2).join("/") + "/";
          const grand = fileMap.get(grandParentPath);
          if (grand?.children) grand.children.push(parent);
        }
      }

      if (parent.children) {
        parent.children.push(node);
      }
    }
  }

  return root;
}