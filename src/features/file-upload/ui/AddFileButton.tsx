import styled from "styled-components";
import { FaPlus } from "react-icons/fa6";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";

const generateFileName = (base = "새 파일", ext = "txt", existingNames: string[]) => {
  let index = 1;
  let name = `${base}.${ext}`;
  while (existingNames.includes(name)) {
    name = `${base} (${index++}).${ext}`;
  }
  return name;
};

export const AddFileButton = () => {
  const selectedNode = useFileTreeStore((state) => state.selectedNode);
  const addNode = useFileTreeStore((state) => state.addNode);
  const setTree = useFileTreeStore((state) => state.setTree);
  const tree = useFileTreeStore((state) => state.tree);

  const handleAddFile = () => {
    const existingNames = new Set<string>();

    const collectNames = (nodes: typeof tree) => {
      nodes.forEach((node) => {
        existingNames.add(node.name);
        if (node.children) collectNames(node.children);
      });
    };
    collectNames(tree);

    const fileName = generateFileName("새 파일", "txt", Array.from(existingNames));
    const newFileNode = {
      name: fileName,
      isDirectory: false,
      content: "",
    };

    if (selectedNode?.isDirectory) {
      addNode(selectedNode.path, newFileNode);
    } else {
      const rootNode = {
        id: crypto.randomUUID(),
        name: fileName,
        path: fileName,
        isDirectory: false,
        content: "",
      };
      setTree([...tree, rootNode]);
    }
  };

  return (
    <StyledButton onClick={handleAddFile}>
      <FaPlus color="lightgray" size={16} />
    </StyledButton>
  );
};
