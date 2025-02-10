import { useMemo } from 'react';
import { ALL_STATS_KEY } from '../constant';
import { DisplayServerItem, GroupedServerItem, OnlineStats } from '../types';
import { generateEmptyOnlineStatItem, getMapKey } from '../utils';

export const useOnlineStats = (
  mapDict: Record<string, DisplayServerItem>,
  groupedItems: GroupedServerItem[]
) => {
  const onlineStats = useMemo<Record<string, OnlineStats>>(() => {
    const nextOnlineStats: Record<string, OnlineStats> = {};

    let rootServerOnlineCount = 0;
    let rootServerTotalCount = 0;
    let rootPlayerOnlineCount = 0;
    let rootPlayerCapacityCount = 0;

    groupedItems.forEach((group) => {
      const groupOnlineStat = generateEmptyOnlineStatItem();

      group.serverList.forEach((s) => {
        rootServerTotalCount += 1;
        groupOnlineStat.allServerCount += 1;
        const mapKey = getMapKey(s);

        if (mapKey in mapDict) {
          rootServerOnlineCount += 1;
          rootPlayerCapacityCount += mapDict[mapKey].maxPlayers;
          rootPlayerOnlineCount += mapDict[mapKey].currentPlayers;

          groupOnlineStat.onlineServerCount += 1;
          groupOnlineStat.playerCapacityCount += mapDict[mapKey].maxPlayers;
          groupOnlineStat.onlinePlayerCount += mapDict[mapKey].currentPlayers;
        }
      });

      nextOnlineStats[group.groupName] = groupOnlineStat;
    });

    nextOnlineStats[ALL_STATS_KEY] = {
      allServerCount: rootServerTotalCount,
      onlineServerCount: rootServerOnlineCount,
      onlinePlayerCount: rootPlayerOnlineCount,
      playerCapacityCount: rootPlayerCapacityCount,
    };

    return nextOnlineStats;
  }, [mapDict, groupedItems]);

  return onlineStats;
};
