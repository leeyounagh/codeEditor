import type { FileNode } from "../model/types";
import { useState } from "react";


export const TreeNode = ({ node }: { node: FileNode }) => {
    const [open, setOpen] = useState(false);
  
    const handleClick = () => {
      if (node.isDirectory) setOpen(prev => !prev);
      else {
        // MonacoEditor + Tabs 열기 로직 트리거
      }
    };
  
    return (
      <div style={{ marginLeft: '16px' }}>
        <div onClick={handleClick}>{node.name}</div>
        {open && node.children?.map(child => (
          <TreeNode key={child.id} node={child} />
        ))}
      </div>
    );
  };
  