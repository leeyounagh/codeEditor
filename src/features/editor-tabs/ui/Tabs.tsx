import { TabItem } from './TabItem';
import { useTabs } from '../model/useTabs';

export const Tabs = () => {
  const { tabs, closeTab } = useTabs();

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
      {tabs.map(tab => (
        <TabItem key={tab.id} tab={tab} onClose={() => closeTab(tab.id)} />
      ))}
    </div>
  );
};
