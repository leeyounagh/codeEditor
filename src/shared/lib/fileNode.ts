import JSZip from "jszip";
import type { FileNode } from "../../entities/file-tree/model/types";

// 이미지 확장자 판별
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];
const isImageFile = (filename: string) =>
  imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));

// Blob을 base64(Data URL)로 변환
const readAsDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function parseZipToFileTree(zipFile: File): Promise<FileNode[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const root: FileNode[] = [];
  const fileMap = new Map<string, FileNode>();

  for (const [filePath, file] of Object.entries(zip.files)) {
    const parts = filePath.split("/").filter(Boolean); // 빈 문자열 제거
    const name = parts[parts.length - 1];
    const isDirectory = file.dir;

    let content: string | undefined = undefined;
    let isBinary = false;

    if (!isDirectory) {
      if (isImageFile(name)) {
        const blob = await file.async("blob");
        content = await readAsDataURL(blob); // ✅ base64로 변환
        isBinary = true;
      } else {
        content = await file.async("string");
      }
    }

    const node: FileNode = {
      id: crypto.randomUUID(),
      name,
      path: filePath,
      isDirectory,
      children: isDirectory ? [] : undefined,
      content,
      isBinary,
    };

    fileMap.set(filePath, node);

    if (parts.length === 1) {
      root.push(node); // 루트 노드
    } else {
      const parentPath = parts.slice(0, -1).join("/") + "/";
      let parent = fileMap.get(parentPath);

      // 중간 폴더 자동 생성
      if (!parent) {
        parent = {
          id: crypto.randomUUID(),
          name: parts[parts.length - 2],
          path: parentPath,
          isDirectory: true,
          children: [],
        };
        fileMap.set(parentPath, parent);

        if (parts.length === 2) {
          root.push(parent);
        } else {
          const grandPath = parts.slice(0, -2).join("/") + "/";
          const grand = fileMap.get(grandPath);
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
