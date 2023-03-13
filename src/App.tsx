import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_STATS_KEY, VERSION } from "./constant";
import { DisplayServerItem, GroupedServerItem, OnlineStats } from "./types";
import {
  generateEmptyOnlineStatItem,
  getCurrentTimeStr,
  getUnlimitedServerList,
} from "./utils";
// import "./App.css";
import Button from "./components/button/Button";

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
        allServerCount: rootServerTotalCount,
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

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const getServerStatClassName = useCallback((curr: number, total: number) => {
    if (curr !== total) {
      return "text-red-500";
    }

    return "text-green-500";
  }, []);

  const getPlayerStatClassName = useCallback((curr: number, total: number) => {
    if (curr === total) {
      return "text-red-500";
    }

    if (curr / total > 0.8) {
      return "text-orange-500";
    }

    return "text-green-500";
  }, []);

  return (
    <div className="container p-4">
      <div className="author">RWR 服务器状态查询 v: {VERSION}</div>
      <div className="border p-2">
        {topMessageList.map((msg, index) => {
          return <p key={index}>{msg}</p>;
        })}
      </div>
      <div className="mt-2">
        <Button
          className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-200"
          onClick={refresh}
          loading={loading}
        >
          点我刷新数据
        </Button>
        {loading && <p className="text-purple-500">刷新中, 请勿操作...</p>}
        <p className="text-orange-500">最后刷新时间:&nbsp;{requestCompletedTime}</p>
      </div>
      <div className="all-stat-area">
        <p
          className={getServerStatClassName(
            onlineStats[ALL_STATS_KEY].onlineServerCount,
            onlineStats[ALL_STATS_KEY].allServerCount
          )}
        >
          服务器在线数: {onlineStats[ALL_STATS_KEY].onlineServerCount} /{" "}
          {onlineStats[ALL_STATS_KEY].allServerCount}
        </p>
        <p
          className={getPlayerStatClassName(
            onlineStats[ALL_STATS_KEY].onlinePlayerCount,
            onlineStats[ALL_STATS_KEY].playerCapacityCount
          )}
        >
          玩家在线数: {onlineStats[ALL_STATS_KEY].onlinePlayerCount} /{" "}
          {onlineStats[ALL_STATS_KEY].playerCapacityCount}
        </p>
      </div>
      {groupedItems.map((grouped) => (
        <div
          className="border rounded border-orange-400 mt-2 mb-2 p-2"
          key={grouped.groupName}
        >
          <h4 className="text-xl font-bold border-b border-indigo-500 pb-2">
            {grouped.groupName}
          </h4>
          <h5 className="text-md border-b border-red-500 pb-2 pt-2">
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
              <h5 className="text-lg font-semibold">{s.name}</h5>
              {mapDict[s.name] ? (
                <>
                  <div className="m-0">
                    国家/地区:
                    {mapDict[s.name].country}
                  </div>
                  <div className="m-0">地图: {mapDict[s.name].mapId}</div>
                  <div className="m-0">
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
                      <ul className="mt-2 mb-2 ml-6 list-disc">
                        {mapDict[s.name].playerList.map((playerName) => (
                          <li className="underline" key={playerName}>
                            {playerName}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "暂无玩家"
                    )}
                  </div>
                </>
              ) : (
                <div className="text-red-500">无法获取数据</div>
              )}

              <div>
                <a href={s.website} className="mr-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-200">
                    访问详情 &gt;
                  </Button>
                </a>

                <Button
                  onClick={() => joinServer(s)}
                  className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 disabled:bg-orange-200"
                >
                  加入服务器 &gt;
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div
        className="fixed cursor-pointer  right-4 bottom-4 p-2 bg-orange-200 hover:text-orange-500"
        onClick={scrollToTop}
      >
        ^ 回到顶部
      </div>
    </div>
  );
}

export default App;
