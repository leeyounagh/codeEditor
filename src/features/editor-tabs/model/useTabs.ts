import { useState } from 'react';
import { Tab } from './types';

export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  const openTab = (newTab: Tab) => {
    setTabs(prev =>
      prev.some(tab => tab.id === newTab.id)
        ? prev.map(tab => ({
            ...tab,
            isActive: tab.id === newTab.id,
          }))
        : [...prev.map(tab => ({ ...tab, isActive: false })), { ...newTab, isActive: true }]
    );
  };

  const closeTab = (id: string) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== id);
      if (filtered.length === 0) return [];
      if (prev.find(tab => tab.id === id)?.isActive) {
        filtered[filtered.length - 1].isActive = true;
      }
      return filtered;
    });
  };

  return { tabs, openTab, closeTab };
};
