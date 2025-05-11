import { FaDownload } from "react-icons/fa";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { FileNode } from "../../../entities/file-tree/model/types";

// base64 → Uint8Array 변환
const decodeBase64ToUint8Array = (base64: string) => {
  const binary = atob(base64);
  const len = binary.length;
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  return uint8Array;
};

// MIME → 확장자 추론
const getExtensionFromMime = (mime: string): string => {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
};

// 재귀적으로 ZIP에 파일 추가
const addToZip = (nodes: FileNode[], currentFolder: JSZip | null) => {
  if (!currentFolder) return;

  nodes.forEach((node) => {
    if (node.isDirectory) {
      const folder = currentFolder.folder(node.name);
      if (node.children) {
        addToZip(node.children, folder);
      }
    } else {
      const content = node.content ?? "";

      // 이미지 파일 (정상 MIME 또는 잘못 저장된 경우 포함)
      const isImageByMime = /^data:image\//.test(content);
      const isImageByExt =
        /^data:application\/octet-stream/.test(content) &&
        node.name.match(/\.(png|jpg|jpeg|webp|svg)$/i);

      if (isImageByMime || isImageByExt) {
        const [mimePart, base64Data] = content.split(",");
        const mime = mimePart.split(":")[1].split(";")[0];
        const extension = getExtensionFromMime(mime);
        const binaryData = decodeBase64ToUint8Array(base64Data);

        const fileName = node.name.includes(".")
          ? node.name
          : node.name + extension;

        currentFolder.file(fileName, binaryData);
      } else {
        const fileName = node.name.includes(".")
          ? node.name
          : node.name + ".txt";

        if (typeof content === "string") {

          currentFolder.file(fileName, content);
        } else {
          currentFolder.file(fileName, "");
        }
      }
    }
  });
};

export const DownloadButton = () => {
  const tree = useFileTreeStore((state) => state.tree);
  const selectedNode = useFileTreeStore((state) => state.selectedNode);

  const handleDownload = async () => {
    if (!selectedNode) {
      alert("다운로드할 항목을 먼저 선택해주세요.");
      return;
    }

    const isRootFile =
      !selectedNode.isDirectory &&
      tree.some((node) => node.path === selectedNode.path);

    const zip = new JSZip();
    let zipFolderName = selectedNode.name.replace(/\.[^/.]+$/, "");
    let zipFolder = zip.folder(zipFolderName);

    if (isRootFile) {
      addToZip([selectedNode], zipFolder);
    } else {
      const findRootNode = (
        target: FileNode,
        roots: FileNode[]
      ): FileNode | null => {
        const isDescendant = (node: FileNode, targetPath: string): boolean => {
          if (node.path === targetPath) return true;
          if (node.children) {
            return node.children.some((child) =>
              isDescendant(child, targetPath)
            );
          }
          return false;
        };
        return roots.find((root) => isDescendant(root, target.path)) || null;
      };

      const root = findRootNode(selectedNode, tree);
      if (!root) {
        alert("ZIP 루트를 찾을 수 없습니다.");
        return;
      }

      zipFolder = zip.folder(root.name);
      zipFolderName = root.name;

      addToZip(root.children || [], zipFolder);
    }

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${zipFolderName}.zip`);
    } catch (err) {
      console.error("❌ ZIP 생성 오류:", err);
      alert("ZIP 파일을 생성하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <StyledButton data-testid="download-button" onClick={handleDownload}>
      <FaDownload color="lightgray" size={16} />
    </StyledButton>
  );
};
