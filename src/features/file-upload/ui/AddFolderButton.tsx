import { FaFolderPlus } from "react-icons/fa";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";
import { type FileNode } from "../../../entities/file-tree/model/types";

export const AddFolderButton = () => {
  const selectedNode = useFileTreeStore((state) => state.selectedNode);
  const addNode = useFileTreeStore((state) => state.addNode);
  const setTree = useFileTreeStore((state) => state.setTree);
  const tree = useFileTreeStore((state) => state.tree);

  const createEmptyFolder = () => {
    const folderName = `새 폴더 ${Math.floor(Math.random() * 1000)}`; // 임시 폴더 이름
    const newFolder = {
      name: folderName,
      isDirectory: true,
    };

    if (selectedNode?.isDirectory) {
      addNode(selectedNode.path, newFolder);
    } else {
      const newRootNode: FileNode = {
        id: crypto.randomUUID(),
        name: folderName,
        path: folderName,
        isDirectory: true,
        children: [],
      };
      setTree([...tree, newRootNode]);
    }
  };

  return (
    <StyledButton onClick={createEmptyFolder}>
      <FaFolderPlus color="lightgray" />
    </StyledButton>
  );
};

