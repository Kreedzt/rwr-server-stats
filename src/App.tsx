import { useMemo, useState } from 'react';
import { VERSION } from './constant';
import { GroupedServerItem, ServerItem } from './types';
import './App.css';

function App() {
    const groupedItems = useMemo<GroupedServerItem[]>(() => {
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

        return groupedServerItemList;
    }, []);

    const topMessageList = useMemo<string[]>(() => {
        return message_list;
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
                            <img src={s.banner_image} alt={s.website}/>
                        </a>
                        <div>
                            <a href={s.website}>
                                <button>
                                    访问详情 &gt;
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
