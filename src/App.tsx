import {useMemo, useState} from 'react'
import ServerList from '../public/server_list.json';
import {GroupedServerItem, ServerItem} from "./types";
import './App.css';

const TYPED_SERVER_LIST = ServerList as ServerItem[];

function App() {
    const groupedItems = useMemo<GroupedServerItem[]>(() => {
        /**
         * key: group name
         * value: ServerItem[]
         */
        const groupedMap = new Map<string, ServerItem[]>();

        TYPED_SERVER_LIST.forEach(serverItem => {
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

  return (
    <div className="App">
        <div className="helper">
            <p>
                若无法显示可能是&nbsp;
                <span>
                    <a href="https://rwrstats.com/">
                        rwrstats.com
                    </a>
                </span>
                &nbsp;
                服务器出现问题, 或者服务器正在换图
            </p>
            <p>
                若长期无法显示, 请联系服务器管理员
            </p>
        </div>
        {groupedItems.map(grouped => (
            <div key={grouped.groupName}>
                <h4>
                    {grouped.groupName}
                </h4>
                {grouped.serverList.map(s => (
                    <div key={s.website}>
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
