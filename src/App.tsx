import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_STATS_KEY, VERSION } from "./constant";
import { DisplayServerItem, GroupedServerItem, OnlineStats } from "./types";
import {
  generateEmptyOnlineStatItem,
  getCurrentTimeStr,
  getUnlimitedServerList,
  isServerMatch,
} from "./utils";
import Button from "./components/button/Button";

// read from env
document.title = ENV.HTML_TITLE;
const MATCH_REGEX = new RegExp(ENV.SERVER_MATCH_REGEX);

function App() {
  const [mapDict, setMapDict] = useState<Record<string, DisplayServerItem>>({});
  const [displayServerList, setDisplayServerList] = useState<
    DisplayServerItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCompletedTime, setRequestCompletedTime] = useState<string>();

  const groupedItems = useMemo<GroupedServerItem[]>(() => {
    /**
     * key: group name
     * value: ServerItem[]
     */
    const groupedMap = new Map<string, DisplayServerItem[]>();

    displayServerList.forEach((serverItem) => {
      const target = groupedMap.get(serverItem.country);
      if (!target) {
        groupedMap.set(serverItem.country, [serverItem]);
      } else {
        target.push(serverItem);
      }
    });

    const groupedServerItemList: GroupedServerItem[] = [];

    groupedMap.forEach((serverItems, group) => {
      groupedServerItemList.push({
        groupName: `地区: ${group}`,
        serverList: serverItems,
      });
    });
    return groupedServerItemList;
  }, [displayServerList]);

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

    return nextOnlineStats;
  }, [displayServerList, groupedItems, mapDict]);

  const topMessageList = useMemo<string[]>(() => {
    return ENV.MESSAGE_LIST.split("\\n");
  }, []);

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

      const serverListWithMatch = serverList.filter((s) => {
        return isServerMatch(ENV, s);
      });

      setDisplayServerList(serverListWithMatch);
      setRequestCompletedTime(getCurrentTimeStr());
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [groupedItems, loading]);

  useEffect(() => {
    refresh();
  }, []);

  const joinServer = useCallback((server: DisplayServerItem) => {
    const url = `steam://rungameid/270150//server_address=${server.ipAddress} server_port=${server.port}`;
    window.open(url);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const getServerStatClassName = useCallback((curr: number, total: number) => {
    if (curr !== total) {
      return "text-red-500";
    }

    if (curr === 0) {
      return "text-gray-500";
    }

    return "text-green-500";
  }, []);

  const getPlayerStatClassName = useCallback((curr: number, total: number) => {
    if (curr === total) {
      return "text-red-500";
    }

    if (curr === 0) {
      return "text-gray-500";
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
        <Button className="btn-blue" onClick={refresh} loading={loading}>
          点我刷新数据
        </Button>
        {loading && <p className="text-purple-500">刷新中, 请勿操作...</p>}
        <p className="text-orange-500">
          最后刷新时间:&nbsp;{requestCompletedTime}
        </p>
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
            <div className="server-item" key={`${s.ipAddress}:${s.port}`}>
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
                <a href={s.url ?? undefined} className="mr-2">
                  <Button className="btn-blue">访问详情 &gt;</Button>
                </a>

                <Button onClick={() => joinServer(s)} className="btn-orange">
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
