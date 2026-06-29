import calendarSvg from '@/assets/icons/calendar.svg';
import groupProfileSvg from '@/assets/icons/group-profile.svg';
import { FriendStatusProfile } from '@/components/common/friend-status';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import type { ChatRoom } from '@/features/chat/types';

type ChatRoomAvatarProps = {
    room: ChatRoom;
};

export function ChatRoomAvatar({ room }: ChatRoomAvatarProps) {
    if (room.kind === 'direct') {
        return (
            <FriendStatusProfile
                slots={room.slots ?? ['green', null, 'green', null]}
                isActive={room.isActive}
                activeColor={room.activeColor}
                size={70}
            />
        );
    }

    if (room.kind === 'appointment') {
        return (
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-relink-lavender-soft">
                <InlineSvgIcon svg={calendarSvg} label="약속방" className="h-9 w-9 opacity-55" />
            </div>
        );
    }

    return (
        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-relink-lavender-soft">
            <InlineSvgIcon svg={groupProfileSvg} label="그룹채팅" className="h-[58px] w-[58px]" />
        </div>
    );
}
