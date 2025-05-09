import styled from "styled-components";
import { FaPlus } from "react-icons/fa6";
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

export const AddFileButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("📂 선택된 파일:", file);
    }
  };

  return (
    <>
      <Button onClick={handleClick}>
        <FaPlus color="lightgray"  size={16}/>
      </Button>
      <HiddenInput
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept="*/*"
      />
    </>
  );
};
