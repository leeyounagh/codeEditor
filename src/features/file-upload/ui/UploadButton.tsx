import { FaUpload } from "react-icons/fa";
import { StyledButton } from "../../../shared/ui/Button";
import { parseZipToFileTree } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";

export const UploadButton = () => {
  const setTree = useFileTreeStore((state) => state.setTree);
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      if (file) {
        console.log("업로드된 파일:", file);

        try {
          const parsedTree = await parseZipToFileTree(file);
          setTree(parsedTree); 
          console.log("파일 트리 상태 저장 완료:", parsedTree);
        } catch (error) {
          console.error("zip 파싱 오류:", error);
          alert("zip 파일을 파싱하는 중 오류가 발생했습니다.\n올바른 zip 파일인지 확인해주세요.");
        }
      }
    };

    input.click();
  };


  return (
    <StyledButton onClick={handleUpload}>
      <FaUpload color="lightgray" size={16} />
    </StyledButton>
  );
};
