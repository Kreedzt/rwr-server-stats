import React from 'react';
import type { FC } from 'react';

interface ITabPaneProps {
    active: string;
    tabs: string[];
    onTabChange: (key: string) => void;
}

const TabPane: FC<ITabPaneProps> = ({
    active,
    tabs,
    onTabChange
}) => {
    return (
        <div role="tablist" className="tabs tabs-box w-fit">
            {tabs.map((tab) => (
                <a
                    key={tab}
                    role="tab"
                    className={`tab ${active === tab ? 'tab-active' : ''}`}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </a>
            ))}
        </div>
    )
};

export default TabPane;