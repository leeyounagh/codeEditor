export const useUpload = () => {
    const handleUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.zip';
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement)?.files?.[0];
        if (file) {
          console.log('업로드된 파일:', file);
        }
      };
      input.click();
    };
  
    return { handleUpload };
  };
  