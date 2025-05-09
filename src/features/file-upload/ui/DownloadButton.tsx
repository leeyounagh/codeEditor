export const DownloadButton = () => {
    const handleDownload = () => {
      console.log('다운로드 실행');
    };
  
    return <button onClick={handleDownload}></button>;
  };