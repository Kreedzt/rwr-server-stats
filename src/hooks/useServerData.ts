import { useState, useCallback, useEffect } from 'react';
import { DisplayServerItem, GroupedServerItem } from '../types';
import { 
  generateEmptyOnlineStatItem,
  getCurrentTimeStr,
  getMapKey,
  getUnlimitedServerList,
  isServerMatch 
} from '../utils';

export const useServerData = () => {
  const [mapDict, setMapDict] = useState<Record<string, DisplayServerItem>>({});
  const [displayServerList, setDisplayServerList] = useState<DisplayServerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestCompletedTime, setRequestCompletedTime] = useState<string>();

  const refresh = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const serverList = await getUnlimitedServerList();
      const newMapDict = serverList.reduce((acc: Record<string, DisplayServerItem>, item) => {
        acc[getMapKey(item)] = item;
        return acc;
      }, {});

      setMapDict(newMapDict);
      setDisplayServerList(serverList.filter(s => isServerMatch(window.ENV, s)));
      setRequestCompletedTime(getCurrentTimeStr());
    } catch (e) {
      console.error("Error fetching server data", e);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    refresh();
  }, []);

  return {
    mapDict,
    displayServerList,
    loading,
    requestCompletedTime,
    refresh
  };
};
