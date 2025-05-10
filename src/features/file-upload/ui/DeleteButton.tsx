import { FaTrash } from "react-icons/fa";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";
import { findFirstFile } from "../../../shared"; 

export const DeleteButton = () => {
  const selectedNode = useFileTreeStore((state) => state.selectedNode);
  const deleteNode = useFileTreeStore((state) => state.deleteNode);
  const setSelectedNode = useFileTreeStore((state) => state.setSelectedNode);
  const tree = useFileTreeStore((state) => state.tree);
  const openTab = useFileTreeStore((state) => state.openTab);

  const handleDelete = () => {
    if (!selectedNode) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    const confirmDelete = window.confirm(`'${selectedNode.name}'을 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    deleteNode(selectedNode.path);
    setSelectedNode(null);

    const updatedTree = tree.filter((n) => n.path !== selectedNode.path); 
    const nextFile = findFirstFile(updatedTree);
    if (nextFile) {
      setSelectedNode(nextFile);
      openTab(nextFile);
    }
  };

  return (
    <StyledButton onClick={handleDelete}>
      <FaTrash color="lightgray" size={16} />
    </StyledButton>
  );
};
