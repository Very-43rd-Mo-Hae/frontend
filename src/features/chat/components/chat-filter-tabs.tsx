import { NavLink } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import type { ChatTabKey } from '@/features/chat/types';

type ChatFilterTab = {
    key: ChatTabKey;
    label: string;
    path: string;
};

const tabs: ChatFilterTab[] = [
    { key: 'group', label: '그룹채팅', path: routePaths.chat },
    { key: 'direct', label: '1:1 채팅', path: routePaths.chatDirect },
    { key: 'appointment', label: '약속방', path: routePaths.chatAppointments },
    { key: 'unread', label: '안 읽음', path: routePaths.chatUnread },
    { key: 'all', label: '전체', path: routePaths.chatAll },
];

export function ChatFilterTabs() {
    return (
        <div className="flex items-center gap-2 overflow-x-auto px-7 pb-4 pt-3 relink-hidden-scrollbar">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.key}
                    to={tab.path}
                    end={tab.path === routePaths.chat}
                    className={({ isActive }) =>
                        `shrink-0 rounded-lg px-3 py-1.5 font-display text-md text-relink-gray-700 transition-colors ${
                            isActive ? 'bg-relink-lavender-middle' : 'bg-relink-lavender-soft'
                        }`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}
        </div>
    );
}
