import type { Tab } from '../model/types';

type Props = {
  tab: Tab;
  onClose: () => void;
};

export const TabItem = ({ tab, onClose }: Props) => {
  return (
    <div style={{
      padding: '8px 12px',
      background: tab.isActive ? '#fff' : '#eee',
      border: tab.isActive ? '1px solid #ccc' : 'none',
      borderBottom: 'none'
    }}>
      {tab.name}
      <button onClick={onClose} style={{ marginLeft: 8 }}>x</button>
    </div>
  );
};
