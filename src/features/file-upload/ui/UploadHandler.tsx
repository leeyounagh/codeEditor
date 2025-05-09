import { UploadButton } from './UploadButton';
import { DownloadButton } from './DownloadButton';

export const UploadHandler = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <UploadButton />
      <DownloadButton />
    </div>
  );
};
