import { describe, it, expect, beforeEach } from 'vitest';
import JSZip from 'jszip';
import { parseZipToFileTree } from '../shared';
import { randomUUID } from 'crypto';

if (!globalThis.crypto?.randomUUID) {
  globalThis.crypto = { ...globalThis.crypto, randomUUID };
}

//  FileReader mock
class MockFileReader {
  onload: ((e: { target: { result: string | ArrayBuffer | null } }) => void) | null = null;
  result: string | ArrayBuffer | null = null;

  readAsDataURL() {
    this.result = 'data:image/png;base64,MOCKED';
    this.onload?.({ target: { result: this.result } });
  }

  readAsArrayBuffer() {
    this.result = new ArrayBuffer(8);
    this.onload?.({ target: { result: this.result } });
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.FileReader = MockFileReader as any;

describe('parseZipToFileTree', () => {
  let zip: JSZip;

  beforeEach(() => {
    zip = new JSZip();
  });

  it('텍스트 파일을 트리로 변환한다', async () => {
    zip.file('hello.txt', 'Hello World');
    const zipData = await zip.generateAsync({ type: 'uint8array' });

    const tree = await parseZipToFileTree(zipData);
    expect(tree).toHaveLength(1);
    expect(tree[0].name).toBe('hello.txt');
    expect(tree[0].content).toBe('Hello World');
    expect(tree[0].isBinary).toBe(false);
  });

  it('이미지 파일을 base64로 변환하고 isBinary를 true로 설정한다', async () => {
    zip.file('image.png', 'fake-image-data');
    const zipData = await zip.generateAsync({ type: 'uint8array' });

    const tree = await parseZipToFileTree(zipData);
    expect(tree[0].name).toBe('image.png');
    expect(tree[0].isBinary).toBe(true);
    expect(tree[0].content).toBe('data:image/png;base64,MOCKED');
  });

  it('하위 폴더 구조가 정상적으로 구성된다', async () => {
    zip.file('docs/readme.md', 'README');
    zip.file('docs/images/logo.png', 'binary');
    const zipData = await zip.generateAsync({ type: 'uint8array' });

    const tree = await parseZipToFileTree(zipData);

    const docs = tree.find((n) => n.name === 'docs');
    expect(docs?.isDirectory).toBe(true);

    const readme = docs?.children?.find((c) => c.name === 'readme.md');
    expect(readme?.content).toBe('README');

    const images = docs?.children?.find((c) => c.name === 'images');
    expect(images?.isDirectory).toBe(true);

    const logo = images?.children?.find((c) => c.name === 'logo.png');
    expect(logo?.isBinary).toBe(true);
    expect(logo?.content).toBe('data:image/png;base64,MOCKED');
  });
});
