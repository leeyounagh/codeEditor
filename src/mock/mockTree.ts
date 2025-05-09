import type { FileNode } from "../entities/file-tree/model/types"

export const mockTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    path: 'src',
    isDirectory: true,
    children: [
      {
        id: '1-1',
        name: 'main.ts',
        path: 'src/main.ts',
        isDirectory: false,
        content: "console.log('Hello from main.ts');",
      },
      {
        id: '1-2',
        name: 'utils',
        path: 'src/utils',
        isDirectory: true,
        children: [
          {
            id: '1-2-1',
            name: 'math.ts',
            path: 'src/utils/math.ts',
            isDirectory: false,
            content: "export const add = (a, b) => a + b;",
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'README.md',
    path: 'README.md',
    isDirectory: false,
    content: '# My Project\nThis is a sample README.',
  },
];
