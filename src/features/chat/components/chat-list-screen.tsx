import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatRoomList } from '@/features/chat/components/chat-room-list';
import type { ChatRoom, ChatTabKey } from '@/features/chat/types';

type ChatListScreenProps = {
    rooms: ChatRoom[];
    tab: ChatTabKey;
};

const tabFilters: Record<ChatTabKey, (room: ChatRoom) => boolean> = {
    group: (room) => room.kind === 'group',
    direct: (room) => room.kind === 'direct',
    appointment: (room) => room.kind === 'appointment',
    unread: (room) => Boolean(room.unreadCount),
    all: () => true,
};

export function ChatListScreen({ rooms, tab }: ChatListScreenProps) {
    const filteredRooms = rooms.filter(tabFilters[tab]);

    return (
        <div className="flex h-full min-h-0 flex-col bg-relink-white">
            <ChatHeader />
            <ChatRoomList rooms={filteredRooms} />
        </div>
    );
}
