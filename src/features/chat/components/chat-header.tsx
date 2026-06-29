import { ChatFilterTabs } from '@/features/chat/components/chat-filter-tabs';

export function ChatHeader() {
    return (
        <header className="shrink-0 border-b border-relink-card bg-relink-white pt-12 shadow-[0_1px_8px_rgba(205,208,255,0.32)]">
            <div className="px-7">
                <h1 className="font-display text-[28px] leading-9 text-relink-gray-700">채팅</h1>
            </div>
            <ChatFilterTabs />
        </header>
    );
}
