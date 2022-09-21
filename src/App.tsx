import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_STATS_KEY, VERSION } from "./constant";
import { DisplayServerItem, GroupedServerItem, OnlineStats } from "./types";
import { getServerList } from "./services";
import {
  generateEmptyOnlineStatItem,
  getCurrentTimeStr,
  getUnlimitedServerList,
  parseServerListFromString,
} from "./utils";
import "./App.css";

function App() {
  const [mapDict, setMapDict] = useState<Record<string, DisplayServerItem>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCompletedTime, setRequestCompletedTime] = useState<string>();
  const [onlineStats, setOnlineStats] = useState<Record<string, OnlineStats>>({
    [ALL_STATS_KEY]: generateEmptyOnlineStatItem(),
  });

  const groupedItems = useMemo<GroupedServerItem[]>(() => {
    /**
     * key: group name
     * value: ServerItem[]
     */
    const groupedMap = new Map<string, ServerItem[]>();

    server_list.forEach((serverItem) => {
      const target = groupedMap.get(serverItem.group);
      if (!target) {
        groupedMap.set(serverItem.group, [serverItem]);
      } else {
        target.push(serverItem);
      }
    });

    const groupedServerItemList: GroupedServerItem[] = [];

    groupedMap.forEach((serverItems, group) => {
      groupedServerItemList.push({
        groupName: group,
        serverList: serverItems,
      });
    });
    return groupedServerItemList;
  }, []);

  const topMessageList = useMemo<string[]>(() => {
    return message_list;
  }, []);

  const updateOnlineStats = useCallback(
    (mapDict: Record<string, DisplayServerItem>) => {
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

          if (s.name in mapDict) {
            rootServerOnlineCount += 1;
            rootPlayerCapacityCount += mapDict[s.name].maxPlayers;
            rootPlayerOnlineCount += mapDict[s.name].currentPlayers;

            groupOnlineStat.onlineServerCount += 1;
            groupOnlineStat.playerCapacityCount += mapDict[s.name].maxPlayers;
            groupOnlineStat.onlinePlayerCount += mapDict[s.name].currentPlayers;
          }
        });

        nextOnlineStats[group.groupName] = groupOnlineStat;
      });

      nextOnlineStats[ALL_STATS_KEY] = {
        allServerCount: rootServerOnlineCount,
        onlineServerCount: rootServerOnlineCount,
        onlinePlayerCount: rootPlayerOnlineCount,
        playerCapacityCount: rootPlayerCapacityCount,
      };

      setOnlineStats(nextOnlineStats);
    },
    [groupedItems]
  );

  const refresh = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const serverList = await getUnlimitedServerList();
      console.log(serverList);

      const newMapDict = serverList.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
      }, {} as Record<string, DisplayServerItem>);

      setMapDict(newMapDict);
      setRequestCompletedTime(getCurrentTimeStr());
      updateOnlineStats(newMapDict);
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [groupedItems, loading, updateOnlineStats]);

  useEffect(() => {
    refresh();
  }, []);

  const joinServer = useCallback((server: ServerItem) => {
    const url = `steam://rungameid/270150//server_address=${server.ip} server_port=${server.port}`;
    window.open(url);
  }, []);

  const getServerStatClassName = useCallback((curr: number, total: number) => {
    if (curr !== total) {
      return "error-msg";
    }

    return "";
  }, []);

  const getPlayerStatClassName = useCallback((curr: number, total: number) => {
    if (curr === total) {
      return "error-msg";
    }

    if (curr / total > 0.8) {
      return "warn-msg";
    }

    return "";
  }, []);

  return (
    <div className="App">
      <div className="author">RWR 服务器状态查询 v: {VERSION}</div>
      <div className="helper">
        {topMessageList.map((msg, index) => {
          return <p key={index}>{msg}</p>;
        })}
      </div>
      <div className="control-area">
        <button onClick={refresh} disabled={loading}>
          点我刷新数据
        </button>
        {loading && <p>刷新中, 请勿操作...</p>}
        <p>最后刷新时间:&nbsp;{requestCompletedTime}</p>
      </div>
      <div className="all-stat-area">
        <p>
          服务器在线数: {onlineStats[ALL_STATS_KEY].onlineServerCount} /{" "}
          {onlineStats[ALL_STATS_KEY].allServerCount}
        </p>
        <p>
          玩家在线数: {onlineStats[ALL_STATS_KEY].onlinePlayerCount} /{" "}
          {onlineStats[ALL_STATS_KEY].playerCapacityCount}
        </p>
      </div>
      {groupedItems.map((grouped) => (
        <div className="group-item" key={grouped.groupName}>
          <h4 className="group-title">{grouped.groupName}</h4>
          <h5 className="group-stat">
            <p
              className={getServerStatClassName(
                onlineStats[grouped.groupName]?.onlineServerCount ?? 0,
                onlineStats[grouped.groupName]?.allServerCount ?? 0
              )}
            >
              服务器在线数: {onlineStats[grouped.groupName]?.onlineServerCount}{" "}
              / {onlineStats[grouped.groupName]?.allServerCount}
            </p>
            <p
              className={getPlayerStatClassName(
                onlineStats[grouped.groupName]?.onlinePlayerCount ?? 0,
                onlineStats[grouped.groupName]?.playerCapacityCount ?? 0
              )}
            >
              玩家在线数: {onlineStats[grouped.groupName]?.onlinePlayerCount} /{" "}
              {onlineStats[grouped.groupName]?.playerCapacityCount}
            </p>
          </h5>
          {grouped.serverList.map((s) => (
            <div className="server-item" key={s.website}>
              <h5>{s.name}</h5>
              {mapDict[s.name] ? (
                <>
                  <div className="para-item">
                    国家/地区:
                    {mapDict[s.name].country}
                  </div>
                  <div className="para-item">地图: {mapDict[s.name].mapId}</div>
                  <div className="para-item">
                    描述:
                    <p>{mapDict[s.name].comment}</p>
                  </div>
                  <div
                    className={`para-item ${getPlayerStatClassName(
                      mapDict[s.name].currentPlayers,
                      mapDict[s.name].maxPlayers
                    )}`}
                  >
                    玩家数量: {mapDict[s.name].currentPlayers} /{" "}
                    {mapDict[s.name].maxPlayers}
                  </div>
                  <div className="para-item">
                    玩家列表:
                    {mapDict[s.name].playerList.length > 0 ? (
                      <ul>
                        {mapDict[s.name].playerList.map((playerName) => (
                          <li key={playerName}>{playerName}</li>
                        ))}
                      </ul>
                    ) : (
                      "暂无玩家"
                    )}
                  </div>
                </>
              ) : (
                <div className="error-msg">无法获取数据</div>
              )}

              <div>
                <a href={s.website}>
                  <button>访问详情 &gt;</button>
                  <button onClick={() => joinServer(s)}>加入服务器 &gt;</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
