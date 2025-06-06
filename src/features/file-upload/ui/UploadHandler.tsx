import { UploadButton } from "./UploadButton";
import { DownloadButton } from "./DownloadButton";
import { AddFileButton } from "./AddFileButton";
import { AddFolderButton } from "./AddFolderButton";
import { DeleteButton } from "./DeleteButton";
import styled from "styled-components";

const UploadHandlerContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const UploadHandler = () => {
  return (
    <UploadHandlerContainer>
      <UploadButton />
      <AddFileButton />
      <AddFolderButton />
      <DownloadButton />
      <DeleteButton />
    </UploadHandlerContainer>
  );
};
