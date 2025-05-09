import { useUpload } from "../model/useUpload";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";

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
  }
`;

export const UploadButton = () => {
  const { handleUpload } = useUpload();

  return (
    <Button onClick={handleUpload}>
      <FaUpload color="lightgray" size={16} />
    </Button>
  );
};
