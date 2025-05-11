import JSZip from "jszip";
import type { FileNode } from "../../entities/file-tree/model/types";

// 이미지 확장자 판별
const imageExtensions = [
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"
];
const isImageFile = (filename: string) =>
  imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));

// Blob → base64 변환
const readAsDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function parseZipToFileTree(zipFile: Blob | File| Uint8Array): Promise<FileNode[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const root: FileNode[] = [];
  const fileMap = new Map<string, FileNode>();

  const entries = Object.entries(zip.files);
  const CHUNK_SIZE = 100;

  for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
    const chunk = entries.slice(i, i + CHUNK_SIZE);

    for (const [filePath, file] of chunk) {
      const parts = filePath.split("/").filter(Boolean);
      const name = parts[parts.length - 1];
      const isDirectory = file.dir;

      let content: string | undefined = undefined;
      let isBinary = false;

      if (!isDirectory) {
        if (isImageFile(name)) {
          const blob = await file.async("blob");
          content = await readAsDataURL(blob);
          isBinary = true;
        } else {
          content = await file.async("string");
          isBinary = false;
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
        root.push(node);
      } else {
        const parentPath = parts.slice(0, -1).join("/") + "/";
        let parent = fileMap.get(parentPath);

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

        parent.children?.push(node);
      }
    }

    //  Chunk 처리 후 잠시 대기
    await new Promise((res) => setTimeout(res, 0));
  }

  return root;
}
