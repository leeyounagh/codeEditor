import styled from "styled-components";
import { FaDownload } from "react-icons/fa";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;

  svg {
    font-size: 16px;
  }
  &:hover {
    background-color: #444;
  }
`;

export const DownloadButton = () => {
  const handleDownload = () => {
    console.log("다운로드 실행");
  };

  return (
    <Button onClick={handleDownload}>
      <FaDownload color="lightgray" size={16} />
    </Button>
  );
};
