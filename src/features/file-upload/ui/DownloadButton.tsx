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

    // ✅ 선택된 노드를 포함하는 최상위 루트 노드 찾기
    const findRootNode = (target: FileNode, roots: FileNode[]): FileNode | null => {
      const isDescendant = (node: FileNode, targetPath: string): boolean => {
        if (node.path === targetPath) return true;
        if (node.children) {
          return node.children.some(child => isDescendant(child, targetPath));
        }
        return false;
      };

      return roots.find(root => isDescendant(root, target.path)) || null;
    };

    const root = findRootNode(selectedNode, tree);

    if (!root) {
      alert("ZIP 루트를 찾을 수 없습니다.");
      return;
    }

    // ✅ JSZip 생성 및 압축
    const zip = new JSZip();
    const zipFolder = zip.folder(root.name);

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

    addToZip(root.children || [], zipFolder);

    try {
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${root.name}.zip`);
      console.log("ZIP 다운로드 완료:", `${root.name}.zip`);
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
