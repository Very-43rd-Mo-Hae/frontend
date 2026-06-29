import type { RingSlots } from '@/components/common/friend-status/ring-colors';

export type MyPageProfile = {
    name: string;
    bio: string;
    friendCount: number;
    signupProvider: string;
    accountId: string;
    email: string;
    slots: RingSlots;
    isActive: boolean;
    activeColor: string;
};
