import { useCallback } from "react";
import { ALL_STATS_KEY, VERSION } from "./constant";
import { DisplayServerItem } from "./types";
import Button from "./components/button/Button";
import { useServerData } from "./hooks/useServerData";
import { useGroupedServers } from "./hooks/useGroupedServers";
import { useOnlineStats } from "./hooks/useOnlineStats";
import { useStatusClass } from "./hooks/useStatusClass";
import { getMapKey } from "./utils"; // Importing getMapKey

// read from env
document.title = window.ENV.HTML_TITLE;

function App() {
  const { mapDict, displayServerList, loading, requestCompletedTime, refresh } =
    useServerData();
  const groupedItems = useGroupedServers(displayServerList);
  const onlineStats = useOnlineStats(mapDict, groupedItems);
  const { getServerStatClassName, getPlayerStatClassName } = useStatusClass();

  const joinServer = useCallback((server: DisplayServerItem) => {
    const url = `steam://rungameid/270150//server_address=${server.ipAddress} server_port=${server.port}`;
    window.open(url);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const topMessageList = window.ENV.MESSAGE_LIST.split("\\n");

  return (
    <div className="container p-4">
      <div className="author">RWR 服务器状态查询 v: {VERSION}</div>
      <div className="border p-2">
        {topMessageList.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div className="mt-2">
        <Button className="btn-primary" onClick={refresh} loading={loading}>
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
          {grouped.serverList.map((s) => {
            const mapKey = getMapKey(s);
            return (
              <div className="server-item" key={`${s.ipAddress}:${s.port}`}>
                <h5 className="text-lg font-semibold">{s.name}</h5>
                {mapDict[mapKey] ? (
                  <>
                    <div className="m-0">
                      国家/地区:
                      {mapDict[mapKey].country}
                    </div>
                    <div className="m-0">地图: {mapDict[mapKey].mapId}</div>
                    <div className="m-0">
                      描述:
                      <p>{mapDict[mapKey].comment}</p>
                    </div>
                    <div
                      className={`para-item ${getPlayerStatClassName(
                        mapDict[mapKey].currentPlayers,
                        mapDict[mapKey].maxPlayers
                      )}`}
                    >
                      玩家数量: {mapDict[mapKey].currentPlayers} /{" "}
                      {mapDict[mapKey].maxPlayers}
                    </div>
                    <div className="para-item">
                      玩家列表:
                      {mapDict[mapKey].playerList.length > 0 ? (
                        <ul className="mt-2 mb-2 ml-6 list-disc">
                          {mapDict[mapKey].playerList.map((playerName) => (
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
                    <Button className="btn-outline btn-success">
                      访问详情 {">"}
                    </Button>
                  </a>

                  <Button
                    onClick={() => joinServer(s)}
                    className="btn-outline btn-warning"
                  >
                    加入服务器 {">"}
                  </Button>
                </div>
              </div>
            );
          })}
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
