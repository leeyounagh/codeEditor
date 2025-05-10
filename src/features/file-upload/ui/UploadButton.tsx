import { useUpload } from "../model/useUpload";
import { FaUpload } from "react-icons/fa";
import { StyledButton } from "../../../shared/ui/Button";

export const UploadButton = () => {
  const { handleUpload } = useUpload();

  return (
    <StyledButton onClick={handleUpload}>
      <FaUpload color="lightgray" size={16} />
    </StyledButton>
  );
};
