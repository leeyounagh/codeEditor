import { FaDownload } from "react-icons/fa";
import { StyledButton } from "../../../shared";



export const DownloadButton = () => {
  const handleDownload = () => {
    console.log("다운로드 실행");
  };

  return (
    <StyledButton onClick={handleDownload}>
      <FaDownload color="lightgray" size={16} />
    </StyledButton>
  );
};
