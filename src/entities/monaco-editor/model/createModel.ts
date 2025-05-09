import * as monaco from 'monaco-editor';
import { extensionToLang } from './extensionToLang';

export function createModel(path: string, content: string) {
  const ext = path.slice(path.lastIndexOf('.'));
  const language = extensionToLang[ext] || 'plaintext';

  const uri = monaco.Uri.parse(`file:///${path}`);
  let model = monaco.editor.getModel(uri);
  if (!model) {
    model = monaco.editor.createModel(content, language, uri);
  }
  return model;
}
