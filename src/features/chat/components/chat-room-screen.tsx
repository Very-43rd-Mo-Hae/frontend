import { useNavigate } from 'react-router-dom';

import settingsSvg from '@/assets/icons/settings.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { ChatBubble } from '@/features/chat/components/chat-bubble';
import { ChatComposer } from '@/features/chat/components/chat-composer';
import { ChatRoomAvatar } from '@/features/chat/components/chat-room-avatar';
import type { ChatRoom } from '@/features/chat/types';

type ChatRoomScreenProps = {
    room: ChatRoom;
};

export function ChatRoomScreen({ room }: ChatRoomScreenProps) {
    const navigate = useNavigate();

    return (
        <div className="flex h-full min-h-0 flex-col bg-relink-white">
            <header className="flex shrink-0 items-center gap-3 border-b border-relink-card px-4 pb-4 pt-11 shadow-[0_1px_8px_rgba(205,208,255,0.32)]">
                <button
                    type="button"
                    aria-label="채팅 목록으로 돌아가기"
                    className="flex h-10 w-10 items-center justify-center rounded-full font-sans text-3xl text-relink-lavender-intense"
                    onClick={() => navigate(-1)}
                >
                    ‹
                </button>
                <ChatRoomAvatar room={room} />
                <div className="min-w-0 flex-1">
                    <h1 className="truncate font-display text-[20px] leading-7 text-relink-ink">{room.name}</h1>
                    <p className="mt-0.5 font-display text-sm text-relink-gray-400">
                        {room.kind === 'direct' ? '1:1 채팅' : `${room.memberCount ?? 1}명 참여 중`}
                    </p>
                </div>
                <button
                    type="button"
                    aria-label={`${room.name} 채팅방 설정`}
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                >
                    <InlineSvgIcon svg={settingsSvg} className="h-[21px] w-[21px]" />
                </button>
            </header>

            <main className="relink-hidden-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
                {room.messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                ))}
            </main>

            <ChatComposer />
        </div>
    );
}
