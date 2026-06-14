import { useState } from 'react';

import { FriendOverviewHeader } from '@/features/home/components/friend/friend-overview-header';
import { FriendStatusModal } from '@/features/home/components/friend/friend-status-modal';
import {
    FriendStatusItem,
    type RingSlots,
} from '@/components/common/friend-status';

type FriendOverview = {
    name: string;
    slots: RingSlots;
    isActive?: boolean;
    activeColor?: string;
};

const friends: FriendOverview[] = [
    {
        name: '김가영',
        slots: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan', 'cyan'],
        isActive: true,
        activeColor: '#66f2f6',
    },
    { name: '김다영', slots: ['cyan', 'cyan', 'cyan', 'cyan', 'cyan'] },
    {
        name: '김마영',
        slots: ['cyan', 'cyan', 'cyan', 'yellow', 'yellow'],
        isActive: true,
        activeColor: '#fee73d',
    },
    {
        name: '김사영',
        slots: ['green', 'green', 'green', 'green'],
    },
    {
        name: '김자영',
        slots: ['yellow', 'yellow', 'green'],
    },
    {
        name: '김하영',
        slots: [],
    },
] as const;

const FriendOverviewCard = () => {
    const [selectedFriend, setSelectedFriend] = useState<FriendOverview | null>(null);

    return (
        <>
            <section className="flex h-[142px] flex-none flex-col overflow-hidden rounded-[10px] border border-relink-card bg-relink-white p-3 shadow-relink-card">
                <FriendOverviewHeader />

                <div className="relink-hidden-scrollbar mt-1 flex h-[96px] items-start overflow-x-auto overflow-y-hidden pt-1">
                    {friends.map((friend) => (
                        <FriendStatusItem
                            key={friend.name}
                            name={friend.name}
                            slots={friend.slots}
                            isActive={friend.isActive}
                            activeColor={friend.activeColor}
                            onClick={() => setSelectedFriend(friend)}
                        />
                    ))}
                </div>
            </section>

            {selectedFriend && (
                <FriendStatusModal
                    slots={selectedFriend.slots}
                    onClose={() => setSelectedFriend(null)}
                />
            )}
        </>
    );
};

export { FriendOverviewCard };
