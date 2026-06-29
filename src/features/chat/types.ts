import type { RingSlots } from '@/components/common/friend-status/ring-colors';

export type ChatTabKey = 'group' | 'direct' | 'appointment' | 'unread' | 'all';

export type ChatRoomKind = 'group' | 'direct' | 'appointment';

export type ChatMessage = {
    id: string;
    sender: 'me' | 'other' | 'system';
    text: string;
    time: string;
};

export type ChatRoom = {
    id: string;
    kind: ChatRoomKind;
    name: string;
    memberCount?: number;
    timeLabel: string;
    lastMessage: string;
    unreadCount?: number;
    slots?: RingSlots;
    isActive?: boolean;
    activeColor?: string;
    messages: ChatMessage[];
};
