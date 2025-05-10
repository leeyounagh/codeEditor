import { UploadButton } from "./UploadButton";
import { DownloadButton } from "./DownloadButton";
import { AddFileButton } from "./AddFileButton";
import { AddFolderButton } from "./AddFolderButton";
import { DeleteButton } from "./DeleteButton";
import styled from "styled-components";

const UploadHandlerContainer = styled.div`
  display: flex;
  align-items: center;
  // gap: 15px;
  // padding: 0 20px ;
`;

export const UploadHandler = () => {
  return (
    <UploadHandlerContainer>
      <UploadButton />
      <AddFileButton />
      <AddFolderButton />
      <DownloadButton />
      <DeleteButton/>
    </UploadHandlerContainer>
  );
};
