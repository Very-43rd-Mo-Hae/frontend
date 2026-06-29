import { ChatRoomRow } from '@/features/chat/components/chat-room-row';
import type { ChatRoom } from '@/features/chat/types';

type ChatRoomListProps = {
    rooms: ChatRoom[];
};

export function ChatRoomList({ rooms }: ChatRoomListProps) {
    return (
        <div className="relink-hidden-scrollbar flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto px-7 pb-8 pt-10">
            {rooms.map((room) => (
                <ChatRoomRow key={room.id} room={room} />
            ))}
        </div>
    );
}
