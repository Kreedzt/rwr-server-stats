import {useCallback, useEffect, useMemo, useState} from 'react';
import { VERSION } from './constant';
import { GroupedServerItem } from './types';
import './App.css';

function App() {
    const [groupedItems, setGroupedItems] = useState<GroupedServerItem[]>([]);

    useEffect(()=> {
        /**
         * key: group name
         * value: ServerItem[]
         */
        const groupedMap = new Map<string, ServerItem[]>();

        server_list.forEach(serverItem => {
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
                serverList: serverItems
            })
        });
        setGroupedItems(groupedServerItemList);
    }, []);

    const topMessageList = useMemo<string[]>(() => {
        return message_list;
    }, []);

    const joinServer = useCallback((server: ServerItem)=> {
        const url = `steam://rungameid/270150//server_address=${server.ip} server_port=${server.port}`;
        window.open(url);
    }, []);

    const getBannerImage = useCallback((server: ServerItem) => {
        const url = `https://rwrstats.com/images/servers/${server.ip}-${server.port}.png`;
        return url;
    }, []);

  return (
    <div className="App">
        <div className="author">
            RWR 服务器状态查询 v: {VERSION}
        </div>
        <div className="helper">
            {topMessageList.map((msg, index) => {
                return (
                    <p key={index}>
                        {msg}
                    </p>
                )
            })}
        </div>
        {groupedItems.map(grouped => (
            <div className="group-item" key={grouped.groupName}>
                <h4 className="group-title">
                    {grouped.groupName}
                </h4>
                {grouped.serverList.map(s => (
                    <div className="server-item" key={s.website}>
                        <h5>
                            {s.name}
                        </h5>
                        <a href={s.website}>
                            <img src={getBannerImage(s)} alt={s.website}/>
                        </a>
                        <div>
                            <a href={s.website}>
                                <button>
                                    访问详情 &gt;
                                </button>
                                <button onClick={() => joinServer(s)}>
                                    加入服务器 &gt;
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
  )
}

export default App
