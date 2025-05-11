import { FaUpload } from "react-icons/fa";
import { StyledButton } from "../../../shared/ui/Button";
import { parseZipToFileTree } from "../../../shared";
import { useFileTreeStore } from "../../../entities/file-tree/model/fileTreeStore";
import { useRef } from "react";

export const UploadButton = () => {
  const setTree = useFileTreeStore((state) => state.setTree);
  const tree = useFileTreeStore((state) => state.tree);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

        setTree([...tree, zipRoot]);
      } catch (error) {
        console.error("zip 파싱 오류:", error);
        alert("올바른 zip 파일인지 확인해주세요.");
      }
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        data-testid="file-input"
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      <StyledButton onClick={() => inputRef.current?.click()}>
        <FaUpload color="lightgray" size={16} />
      </StyledButton>
    </>
  );
};
