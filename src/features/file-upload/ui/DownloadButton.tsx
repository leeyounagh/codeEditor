import { FaDownload } from "react-icons/fa";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { type FileNode } from "../../../entities/file-tree/model/types";



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
          currentFolder.file(node.name, node.content ?? "");
        }
      });
    };

    if (isRootFile) {
      // ✅ 루트에 있는 단일 파일인 경우 → 폴더 만들고 그 안에 파일 1개만
      zipFolder?.file(selectedNode.name, selectedNode.content ?? "");
    } else {
      // ✅ 기존 로직: 선택된 노드를 포함하는 루트 폴더 전체 압축
      const findRootNode = (target: FileNode, roots: FileNode[]): FileNode | null => {
        const isDescendant = (node: FileNode, targetPath: string): boolean => {
          if (node.path === targetPath) return true;
          if (node.children) {
            return node.children.some((child) => isDescendant(child, targetPath));
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
