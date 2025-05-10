

export const useUpload = () => {
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
          setTree(parsedTree); // ✅ zustand에 저장
          console.log("파일 트리 상태 저장 완료:", parsedTree);
        } catch (error) {
          console.error("zip 파싱 오류:", error);
        }
      }
    };

    input.click();
    };
  
    return { handleUpload };
  };
  