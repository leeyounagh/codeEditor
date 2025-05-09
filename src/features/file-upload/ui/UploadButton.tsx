import { useUpload } from "../model/useUpload";

export const UploadButton = () => {
  const { handleUpload } = useUpload();

  return <button onClick={handleUpload}>파일 업로드</button>;
};
