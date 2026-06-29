import { chatRooms } from '@/features/chat/chat-data';
import { ChatListScreen } from '@/features/chat/components/chat-list-screen';
import type { ChatTabKey } from '@/features/chat/types';

type ChatListViewProps = {
    tab: ChatTabKey;
};

export function ChatListView({ tab }: ChatListViewProps) {
    return <ChatListScreen rooms={chatRooms} tab={tab} />;
}
