import { FaDownload } from "react-icons/fa";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { type FileNode } from "../../../entities/file-tree/model/types";

// base64 -> Uint8Array (바이너리 복원)
const decodeBase64ToUint8Array = (base64: string) => {
  const binary = atob(base64);
  const len = binary.length;
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  return uint8Array;
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
          if (/^data:image\//.test(content)) {
            // ✅ base64 → 바이너리로 복원해서 저장
            const base64 = content.split(",")[1];
            const binaryData = decodeBase64ToUint8Array(base64);
            currentFolder.file(node.name, binaryData);
          } else {
            currentFolder.file(node.name, content);
          }
        }
      });
    };

    if (isRootFile) {
      const content = selectedNode.content ?? "";
      if (/^data:image\//.test(content)) {
        const base64 = content.split(",")[1];
        const binaryData = decodeBase64ToUint8Array(base64);
        zipFolder?.file(selectedNode.name, binaryData);
      } else {
        zipFolder?.file(selectedNode.name, content);
      }
    } else {
      // 폴더 선택 시 전체 하위 포함
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
      addToZip(root.children || [], zipFolder);
      zipFolderName = root.name;
    }

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${zipFolderName}.zip`);
    } catch (err) {
      console.error("ZIP 생성 오류:", err);
      alert("ZIP 파일을 생성하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <StyledButton onClick={handleDownload}>
      <FaDownload color="lightgray" size={16} />
    </StyledButton>
  );
};
