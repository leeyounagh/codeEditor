const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];

export function getFileType(filename: string): 'binary' | 'editable' {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();

  if (imageExtensions.includes(ext)) {
    return 'binary'; //  오직 이미지 파일만 binary
  }

  return 'editable'; //  나머지는 전부 editable
}
