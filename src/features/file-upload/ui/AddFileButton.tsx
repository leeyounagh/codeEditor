import styled from "styled-components";
import { FaPlus } from "react-icons/fa6";
import { useRef } from "react";
import { StyledButton } from "../../../shared";



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
      <StyledButton onClick={handleClick}>
        <FaPlus color="lightgray"  size={16}/>
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
