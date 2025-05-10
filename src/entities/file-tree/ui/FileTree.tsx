import type { FileNode } from '../model/types';
import { TreeNode } from './TreeNode';

export const FileTree = ({ tree }: { tree: FileNode[] }) => {
  return (
    <div >
      {tree.map(node => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};
