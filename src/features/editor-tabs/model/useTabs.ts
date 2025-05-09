import { flattenFiles } from "./flattenFiles";
import { useState } from "react";
import type { Tab } from "./types";
import { mockTree } from "../../../mock/mockTree";

export const useTabs = () => {
  const initialTabs: Tab[] = (() => {
    const files = flattenFiles(mockTree).slice(0, 3);
    return files.map((file, idx) => ({
      id: file.path,
      name: file.name,
      isActive: idx === 0,
      content: file.content ?? "",
    }));
  })();

  const [tabs, setTabs] = useState<Tab[]>(initialTabs);


  const openTab = (newTab: Tab) => {
    setTabs((prev) => {
      const exists = prev.find((tab) => tab.id === newTab.id);


      if (exists) {
        return prev.map((tab) => ({
          ...tab,
          isActive: tab.id === newTab.id,
        }));
      }

      return [
        ...prev.map((tab) => ({ ...tab, isActive: false })),
        { ...newTab, isActive: true },
      ];
    });
  };

const closeTab = (id: string) => {
  setTabs((prev) => {
    const isClosingActive = prev.find((tab) => tab.id === id)?.isActive;
    const filtered = prev.filter((tab) => tab.id !== id);

    if (filtered.length === 0) return [];

    if (isClosingActive) {
      return filtered.map((tab, idx) => ({
        ...tab,
        isActive: idx === 0,
      }));
    }

    return filtered.map((tab) => ({ ...tab }));
  });
};

  return { tabs, openTab, closeTab };
};
