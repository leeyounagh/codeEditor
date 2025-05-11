import { describe, it, expect, beforeEach } from 'vitest';
import { useFileTreeStore } from '../entities/file-tree/model/fileTreeStore';
import type { FileNode } from '../entities/file-tree/model/types';
import { act } from '@testing-library/react';


describe('updateFileContent', () => {
  const filePath = '/hello.txt';
  const initialContent = 'Original content';
  const updatedContent = 'Updated content';

  const mockFileNode: FileNode = {
    id: '1',
    name: 'hello.txt',
    path: filePath,
    isDirectory: false,
    content: initialContent,
  };

  const initialState = {
    tree: [mockFileNode],
    openedTabs: [{ ...mockFileNode, isActive: true }],
    selectedNode: { ...mockFileNode },
  };

  beforeEach(() => {
    // zustand store 상태 초기화
    useFileTreeStore.setState(initialState);
  });

  it('tree, openedTabs, selectedNode의 content를 모두 수정한다', () => {
    act(() => {
      useFileTreeStore.getState().updateFileContent(filePath, updatedContent);
    });

    const { tree, openedTabs, selectedNode } = useFileTreeStore.getState();

    expect(tree[0].content).toBe(updatedContent);
    expect(openedTabs[0].content).toBe(updatedContent);
    expect(selectedNode?.content).toBe(updatedContent);
  });

  it('선택된 노드의 path가 다르면 selectedNode는 그대로 유지된다', () => {
    // path 다른 selectedNode 설정
    useFileTreeStore.setState({
      selectedNode: { ...mockFileNode, path: '/other.txt' },
    });

    act(() => {
      useFileTreeStore.getState().updateFileContent(filePath, updatedContent);
    });

    const { selectedNode } = useFileTreeStore.getState();
    expect(selectedNode?.path).toBe('/other.txt');
    expect(selectedNode?.content).toBe(initialContent); // 변경 안 되어야 함
  });
});