import { FaUpload } from "react-icons/fa";
import { StyledButton } from "../../../shared/ui/Button";
import { parseZipToFileTree } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";

export const UploadButton = () => {
  const setTree = useFileTreeStore((state) => state.setTree);
  const tree = useFileTreeStore((state) => state.tree); // ✅ 기존 트리 가져오기

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
          const zipName = file.name.replace(/\.zip$/i, "");

          const zipRoot = {
            id: crypto.randomUUID(),
            name: zipName,
            path: zipName,
            isDirectory: true,
            children: parsedTree,
          };

          try {
            setTree([...tree, zipRoot]); // ✅ 여기 감싸기
            console.log("트리에 zip 루트 추가 완료:", zipRoot);
          } catch (err) {
            console.error("저장 중 오류 발생:", err);
            alert(
              "파일을 저장하는 중 오류가 발생했습니다.\n파일 크기가 너무 클 수 있습니다."
            );
          }
        } catch (error) {
          console.error("zip 파싱 오류:", error);
          alert(
            "zip 파일을 파싱하는 중 오류가 발생했습니다.\n올바른 zip 파일인지 확인해주세요."
          );
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
