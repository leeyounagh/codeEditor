import styled from "styled-components";
import { FaFolderPlus } from "react-icons/fa";
import { useRef } from "react";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;

  svg {
    font-size: 16px;
    margin-right: 6px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

export const AddFolderButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("📁 선택된 폴더 파일 목록:");
      Array.from(files).forEach((file) => {
        console.log(file.webkitRelativePath);
      });
    }
  };

  return (
    <>
      <Button onClick={handleClick}>
        <FaFolderPlus color="lightgray" />
      </Button>
      <HiddenInput
        ref={inputRef}
        type="file"
        webkitdirectory="true" 
        directory="" 
        onChange={handleFolderChange}
      />
    </>
  );
};
