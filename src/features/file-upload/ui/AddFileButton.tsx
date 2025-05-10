import styled from "styled-components";
import { FaPlus } from "react-icons/fa6";
import { useRef } from "react";
import { StyledButton } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";

const HiddenInput = styled.input`
  display: none;
`;

export const AddFileButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedNode = useFileTreeStore((state) => state.selectedNode);
  const addNode = useFileTreeStore((state) => state.addNode);
  const setTree = useFileTreeStore((state) => state.setTree);
  const tree = useFileTreeStore((state) => state.tree);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    const newNode = {
      name: file.name,
      isDirectory: false,
      content,
    };

    if (selectedNode?.isDirectory) {
      addNode(selectedNode.path, newNode);
    } else {
      const rootNode = {
        id: crypto.randomUUID(),
        name: file.name,
        path: file.name,
        isDirectory: false,
        content,
      };
      setTree([...tree, rootNode]);
    }
 
    event.target.value = "";
  };

  return (
    <>
      <StyledButton onClick={handleClick}>
        <FaPlus color="lightgray" size={16} />
      </StyledButton>
      <HiddenInput
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept="*/*"
      />
    </>
  );
};
