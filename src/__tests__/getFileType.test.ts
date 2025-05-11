import { describe, it, expect } from 'vitest';
import { getFileType } from '../shared/lib/getFileType';

describe('getFileType', () => {
  it('이미지 확장자는 binary를 반환해야 한다', () => {
    const imageFiles = [
      'photo.png',
      'icon.jpg',
      'banner.jpeg',
      'animation.gif',
      'logo.webp',
      'picture.bmp',
      'vector.svg',
    ];

    for (const filename of imageFiles) {
      expect(getFileType(filename)).toBe('binary');
    }
  });

  it('이미지가 아닌 파일은 editable을 반환해야 한다', () => {
    const textFiles = [
      'readme.md',
      'script.js',
      'style.css',
      'document.pdf',
      'archive.zip',
      'data.json',
      'notes.txt',
    ];

    for (const filename of textFiles) {
      expect(getFileType(filename)).toBe('editable');
    }
  });

  it('대문자 확장자도 binary로 인식해야 한다', () => {
    expect(getFileType('image.PNG')).toBe('binary');
    expect(getFileType('photo.JPEG')).toBe('binary');
  });

  it('확장자가 없으면 editable을 반환한다', () => {
    expect(getFileType('noextension')).toBe('editable');
  });
});
