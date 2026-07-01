import { useEffect, useState } from 'react';

import {
    fetchFriends,
    fetchFriendStatuses,
    type FriendStatusMap,
} from '@/api/friends';
import {
    fetchMyGroups,
    type GroupOverview,
} from '@/api/groups';
import groupProfileSvg from '@/assets/icons/group-profile.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import {
    FriendOverviewHeader,
    type FriendOverviewTab,
} from '@/features/home/components/friend/friend-overview-header';
import { FriendStatusModal } from '@/features/home/components/friend/friend-status-modal';
import {
    FriendStatusItem,
    applyFriendStatuses,
} from '@/components/common/friend-status';
import type { FriendOverview } from '@/features/friends/types';

const FRIEND_CANDIDATE_FETCH_LIMIT = 50;
const FRIEND_STATUS_BATCH_SIZE = 10;
const VISIBLE_FRIEND_LIMIT = 5;
const GROUP_FETCH_LIMIT = 10;
const VISIBLE_GROUP_LIMIT = 5;

function getAvailabilityScore(friend: FriendOverview) {
    return friend.slots.reduce((score, slot) => {
        if (slot === 'green') {
            return score + 2;
        }

        if (slot === 'yellow') {
            return score + 1;
        }

        return score;
    }, 0);
}

function sortByHomePriority(friends: FriendOverview[]) {
    return friends
        .map((friend, index) => ({ friend, index }))
        .sort((left, right) => {
            const lightningPriority = Number(right.friend.isActive ?? false) - Number(left.friend.isActive ?? false);

            if (lightningPriority !== 0) {
                return lightningPriority;
            }

            const availabilityPriority = getAvailabilityScore(right.friend) - getAvailabilityScore(left.friend);

            if (availabilityPriority !== 0) {
                return availabilityPriority;
            }

            return left.index - right.index;
        })
        .map(({ friend }) => friend);
}

async function fetchStatusMapInBatches(memberIds: number[]) {
    const statusMaps = await Promise.all(
        Array.from({ length: Math.ceil(memberIds.length / FRIEND_STATUS_BATCH_SIZE) }, (_, index) => {
            const startIndex = index * FRIEND_STATUS_BATCH_SIZE;
            return fetchFriendStatuses(memberIds.slice(startIndex, startIndex + FRIEND_STATUS_BATCH_SIZE));
        }),
    );

    return statusMaps.reduce<FriendStatusMap>((mergedStatusMap, statusMap) => {
        statusMap.forEach((status, memberId) => {
            mergedStatusMap.set(memberId, status);
        });

        return mergedStatusMap;
    }, new Map());
}

function GroupOverviewItem({ group }: { group: GroupOverview }) {
    return (
        <button
            type="button"
            className="flex h-[88px] basis-1/5 shrink-0 grow-0 cursor-pointer flex-col items-center bg-transparent p-0 text-inherit"
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-relink-lavender-soft">
                <InlineSvgIcon
                    svg={groupProfileSvg}
                    label={`${group.name} 그룹`}
                    className="h-[46px] w-[46px]"
                />
            </div>
            <p className="mt-[3px] max-w-[64px] truncate text-center font-display text-sm text-relink-ink">
                {group.name}
            </p>
            <p className="max-w-[64px] truncate text-center font-display text-[11px] leading-3 text-gray-400">
                {group.memberCount}명
            </p>
        </button>
    );
}

const FriendOverviewCard = () => {
    const [activeTab, setActiveTab] = useState<FriendOverviewTab>('friends');
    const [friends, setFriends] = useState<FriendOverview[]>([]);
    const [groups, setGroups] = useState<GroupOverview[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<FriendOverview | null>(null);
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadFriends() {
            setIsLoadingFriends(true);

            try {
                const response = await fetchFriends({ size: FRIEND_CANDIDATE_FETCH_LIMIT });
                const statusMap = await fetchStatusMapInBatches(response.friends.map((friend) => friend.memberId));
                const friendsWithStatuses = applyFriendStatuses(response.friends, statusMap);

                if (isMounted) {
                    setFriends(sortByHomePriority(friendsWithStatuses).slice(0, VISIBLE_FRIEND_LIMIT));
                }
            } catch {
                if (isMounted) {
                    setFriends([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingFriends(false);
                }
            }
        }

        void loadFriends();

        const handleLightningUpdated = () => {
            void loadFriends();
        };

        window.addEventListener('relink:lightning-updated', handleLightningUpdated);

        return () => {
            isMounted = false;
            window.removeEventListener('relink:lightning-updated', handleLightningUpdated);
        };
    }, []);

    useEffect(() => {
        if (activeTab !== 'groups' || groups.length > 0) {
            return;
        }

        let isMounted = true;

        async function loadGroups() {
            setIsLoadingGroups(true);

            try {
                const nextGroups = await fetchMyGroups(GROUP_FETCH_LIMIT);

                if (isMounted) {
                    setGroups(nextGroups.slice(0, VISIBLE_GROUP_LIMIT));
                }
            } catch {
                if (isMounted) {
                    setGroups([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingGroups(false);
                }
            }
        }

        void loadGroups();

        return () => {
            isMounted = false;
        };
    }, [activeTab, groups.length]);

    return (
        <>
            <section className="flex h-[142px] flex-none flex-col overflow-hidden rounded-[10px] border border-relink-card bg-relink-white p-3 shadow-relink-card">
                <FriendOverviewHeader activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="mt-1 flex h-[96px] items-start overflow-hidden pt-1">
                    {activeTab === 'friends' && isLoadingFriends ? (
                        <p className="flex h-[88px] flex-1 items-center justify-center font-display text-sm text-gray-400">
                            친구 상태를 불러오는 중
                        </p>
                    ) : activeTab === 'friends' && friends.length > 0 ? (
                        friends.map((friend) => (
                            <FriendStatusItem
                                key={friend.memberId}
                                name={friend.name}
                                slots={friend.slots}
                                isActive={friend.isActive}
                                activeColor={friend.activeColor}
                                imageUrl={friend.imageUrl}
                                onClick={() => setSelectedFriend(friend)}
                            />
                        ))
                    ) : activeTab === 'friends' ? (
                        <p className="flex h-[88px] flex-1 items-center justify-center font-display text-sm text-gray-400">
                            표시할 친구가 없어요
                        </p>
                    ) : isLoadingGroups ? (
                        <p className="flex h-[88px] flex-1 items-center justify-center font-display text-sm text-gray-400">
                            그룹을 불러오는 중
                        </p>
                    ) : groups.length > 0 ? (
                        groups.map((group) => (
                            <GroupOverviewItem key={group.groupId} group={group} />
                        ))
                    ) : (
                        <p className="flex h-[88px] flex-1 items-center justify-center font-display text-sm text-gray-400">
                            표시할 그룹이 없어요
                        </p>
                    )}
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
