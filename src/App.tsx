import { useCallback, useEffect, useMemo, useState } from "react";
import { VERSION } from "./constant";
import { DisplayServerItem, GroupedServerItem } from "./types";
import { getServerList } from "./services";
import {getCurrentTimeStr, getUnlimitedServerList, parseServerListFromString} from "./utils";
import "./App.css";

function App() {
  const [mapDict, setMapDict] = useState<Record<string, DisplayServerItem>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCompletedTime, setRequestCompletedTime] = useState<string>();

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
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [groupedItems, loading]);

  useEffect(() => {
    refresh();
  }, []);

  const joinServer = useCallback((server: ServerItem) => {
    const url = `steam://rungameid/270150//server_address=${server.ip} server_port=${server.port}`;
    window.open(url);
  }, []);

  return (
    <div className="App">
      <div className="author">RWR 服务器状态查询 v: {VERSION}</div>
      <div className="helper">
        {topMessageList.map((msg, index) => {
          return <p key={index}>{msg}</p>;
        })}
      </div>
      <div>
        <button onClick={refresh} disabled={loading}>点我刷新数据</button>
        <p>最后刷新时间:{requestCompletedTime}</p>
        {loading && (
            <p>刷新中, 请勿操作...</p>
        )}
      </div>
      {groupedItems.map((grouped) => (
        <div className="group-item" key={grouped.groupName}>
          <h4 className="group-title">{grouped.groupName}</h4>
          {grouped.serverList.map((s) => (
            <div className="server-item" key={s.website}>
              <h5>{s.name}</h5>
              <div className="para-item">
                国家/地区:
                {mapDict[s.name]?.country}
              </div>
              <div className="para-item">地图: {mapDict[s.name]?.mapId}</div>
              <div className="para-item">
                描述:
                <p>{mapDict[s.name]?.comment}</p>
              </div>
              <div className="para-item">
                玩家数量: {mapDict[s.name]?.currentPlayers} /{" "}
                {mapDict[s.name]?.maxPlayers}
              </div>
              <div className="para-item">
                玩家列表:
                {mapDict[s.name] && mapDict[s.name].playerList.length > 0 ? (
                  <ul>
                    {mapDict[s.name].playerList.map((playerName) => (
                      <li key={playerName}>{playerName}</li>
                    ))}
                  </ul>
                ) : (
                  "暂无玩家"
                )}
              </div>
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
