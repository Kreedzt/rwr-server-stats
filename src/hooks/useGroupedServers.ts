import { useMemo } from 'react';
import { GroupedServerItem, DisplayServerItem } from '../types';

export const useGroupedServers = (displayServerList: DisplayServerItem[]) => {
  return useMemo<GroupedServerItem[]>(() => {
    const groupedMap = new Map<string, DisplayServerItem[]>();

    displayServerList.forEach((serverItem) => {
      const target = groupedMap.get(serverItem.country);
      if (!target) {
        groupedMap.set(serverItem.country, [serverItem]);
      } else {
        target.push(serverItem);
      }
    });

    return Array.from(groupedMap.entries()).map(([country, serverList]) => ({
      groupName: `地区: ${country}`,
      serverList
    }));
  }, [displayServerList]);
};
