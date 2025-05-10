const editableExtensions = ['.txt', '.md', '.js', '.ts', '.tsx', '.json', '.html', '.css', '.jsx'];

export function getFileType(filename: string): 'binary' | 'editable' {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return editableExtensions.includes(ext) ? 'editable' : 'binary';
}
