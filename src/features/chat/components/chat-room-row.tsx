import { useNavigate } from 'react-router-dom';

import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { routePaths } from '@/constants/route-paths';
import { ChatRoomAvatar } from '@/features/chat/components/chat-room-avatar';
import type { ChatRoom } from '@/features/chat/types';

type ChatRoomRowProps = {
    room: ChatRoom;
};

export function ChatRoomRow({ room }: ChatRoomRowProps) {
    const navigate = useNavigate();

    return (
        <article className="flex items-center gap-5">
            <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-5 text-left"
                onClick={() => navigate(routePaths.chatRoom(room.id))}
            >
                <ChatRoomAvatar room={room} />

                <div className="min-w-0 flex-1 pt-1">
                    <div className="flex min-w-0 items-center gap-3">
                        <h2 className="truncate font-display text-[17px] leading-6 text-relink-ink">
                            {room.name}
                        </h2>
                        {room.memberCount ? (
                            <span className="shrink-0 font-display text-sm text-relink-gray-400">
                                {room.memberCount}
                            </span>
                        ) : null}
                        <span className="shrink-0 font-display text-sm text-relink-gray-400">
                            {room.timeLabel}
                        </span>
                        {room.unreadCount ? (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-relink-lavender-intense px-1.5 font-display text-sm leading-none text-relink-white">
                                {room.unreadCount}
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-1 truncate font-display text-sm text-relink-gray-400">
                        {room.lastMessage}
                    </p>
                </div>
            </button>

            <button
                type="button"
                aria-label={`${room.name} 채팅방 설정`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
                <InlineSvgIcon svg={settingsSvg} className="h-[21px] w-[21px]" />
            </button>
        </article>
    );
}
