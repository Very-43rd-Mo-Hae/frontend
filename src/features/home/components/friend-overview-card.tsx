import { FriendOverviewHeader } from '@/features/home/components/friend-overview-header';
import { FriendStatusItem } from '@/features/home/components/friend-status-item';
import { type RingSlots } from '@/features/home/constants/ring-colors';

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
    return (
        <section className="flex h-[125px] flex-col overflow-hidden rounded-[10px] border border-relink-card bg-relink-white px-[13px] pt-[13px] shadow-relink-card">
            <FriendOverviewHeader />

            <div className="relink-hidden-scrollbar mt-[3px] flex min-h-0 flex-1 items-start overflow-x-auto overflow-y-hidden px-[5px] pb-1">
                {friends.map((friend) => (
                    <FriendStatusItem
                        key={friend.name}
                        name={friend.name}
                        slots={friend.slots}
                        isActive={friend.isActive}
                        activeColor={friend.activeColor}
                    />
                ))}
            </div>
        </section>
    );
};

export { FriendOverviewCard };
