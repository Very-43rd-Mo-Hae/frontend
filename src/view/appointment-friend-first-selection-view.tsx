import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { fetchAppointmentFriendCalendars } from '@/api/appointments';
import { fetchFriends } from '@/api/friends';
import { routePaths } from '@/constants/route-paths';
import { AppointmentFriendFirstSelectionScreen } from '@/features/schedule/components/appointment-friend-first-selection-screen';
import {
    formatSelectedTimeLabel,
    getTimeSlotKey,
    type FriendFirstStep,
    type TimeSlot,
} from '@/features/schedule/components/appointment-friend-first-utils';
import { AppointmentOverlapTimeSelectionView } from '@/features/schedule/components/appointment-overlap-time-selection-view';
import { AppointmentProposalReview } from '@/features/schedule/components/appointment-proposal-review';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';
import type { AppointmentSelection } from '@/features/schedule/types';

export function AppointmentFriendFirstSelectionView() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialSelectedFriendNames = getInitialSelectedFriendNames(location.state);
    const shouldSkipFriendSelection = getShouldSkipFriendSelection(location.state);
    const [step, setStep] = useState<FriendFirstStep>(shouldSkipFriendSelection ? 'time' : 'friends');
    const [selectedFriendNames, setSelectedFriendNames] = useState<string[]>(initialSelectedFriendNames);
    const [calendarPreviewName, setCalendarPreviewName] = useState<string | null>(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
    const [proposalSelection, setProposalSelection] = useState<AppointmentSelection | null>(null);
    const [friends, setFriends] = useState<AppointmentFriend[]>([]);
    const [friendsWithCalendars, setFriendsWithCalendars] = useState<AppointmentFriend[]>([]);
    const selectedFriends = useMemo(
        () => friendsWithCalendars.filter((friend) => selectedFriendNames.includes(friend.name)),
        [friendsWithCalendars, selectedFriendNames],
    );

    useEffect(() => {
        let ignore = false;

        fetchFriends({ size: 50 })
            .then((response) => {
                if (!ignore) {
                    setFriends(response.friends.map(toAppointmentFriend));
                }
            })
            .catch(() => {
                if (!ignore) {
                    setFriends([]);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;
        const selectedMemberIds = friends
            .filter((friend) => selectedFriendNames.includes(friend.name) && typeof friend.memberId === 'number')
            .map((friend) => friend.memberId as number);

        if (selectedMemberIds.length === 0) {
            setFriendsWithCalendars(friends);
            return () => {
                ignore = true;
            };
        }

        fetchAppointmentFriendCalendars(selectedMemberIds, new Date())
            .then((calendarFriends) => {
                if (!ignore) {
                    const calendarByMemberId = new Map(calendarFriends.map((friend) => [friend.memberId, friend]));
                    setFriendsWithCalendars(
                        friends.map((friend) => {
                            const calendarFriend = friend.memberId ? calendarByMemberId.get(friend.memberId) : undefined;

                            return calendarFriend ?? friend;
                        }),
                    );
                }
            })
            .catch(() => {
                if (!ignore) {
                    setFriendsWithCalendars(friends);
                }
            });

        return () => {
            ignore = true;
        };
    }, [friends, selectedFriendNames]);

    const toggleFriend = (friendName: string) => {
        setSelectedFriendNames((currentNames) =>
            currentNames.includes(friendName)
                ? currentNames.filter((currentName) => currentName !== friendName)
                : [...currentNames, friendName],
        );
    };

    if (step === 'review' && proposalSelection) {
        return (
            <AppointmentProposalReview
                selection={proposalSelection}
                selectedFriends={selectedFriends}
                onBack={() => setStep('time')}
            />
        );
    }

    if (step === 'time') {
        return (
            <AppointmentOverlapTimeSelectionView
                selectedFriends={selectedFriends}
                selectedTimeSlots={selectedTimeSlots}
                onSelectedTimeSlotsChange={setSelectedTimeSlots}
                onBack={() => {
                    if (shouldSkipFriendSelection) {
                        navigate(routePaths.appointmentGroups);
                        return;
                    }

                    setStep('friends');
                }}
                onConfirm={() => {
                    setProposalSelection({
                        slotKeys: selectedTimeSlots.map((slot) => getTimeSlotKey(slot.dayIndex, slot.time)),
                        label: formatSelectedTimeLabel(selectedTimeSlots),
                        ...toAppointmentDateTimeRange(selectedTimeSlots),
                    });
                    setStep('review');
                }}
            />
        );
    }

    return (
        <AppointmentFriendFirstSelectionScreen
            friends={friendsWithCalendars}
            selectedFriendNames={selectedFriendNames}
            calendarPreviewName={calendarPreviewName}
            onFriendToggle={toggleFriend}
            onCalendarOpen={setCalendarPreviewName}
            onCalendarClose={() => setCalendarPreviewName(null)}
            onNext={() => {
                setSelectedTimeSlots([]);
                setStep('time');
            }}
        />
    );
}

function getInitialSelectedFriendNames(state: unknown) {
    if (!state || typeof state !== 'object' || !('initialSelectedFriendNames' in state)) {
        return [];
    }

    const { initialSelectedFriendNames } = state as { initialSelectedFriendNames?: unknown };

    if (!Array.isArray(initialSelectedFriendNames)) {
        return [];
    }

    return initialSelectedFriendNames.filter(
        (friendName): friendName is string => typeof friendName === 'string',
    );
}

function getShouldSkipFriendSelection(state: unknown) {
    return Boolean(state && typeof state === 'object' && 'skipFriendSelection' in state && state.skipFriendSelection);
}

function toAppointmentFriend(friend: { memberId: number; name: string; imageUrl?: string | null }): AppointmentFriend {
    return {
        memberId: friend.memberId,
        name: friend.name,
        imageUrl: friend.imageUrl,
        availability: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'empty'],
    };
}

function toAppointmentDateTimeRange(slots: TimeSlot[]) {
    const sortedSlots = [...slots].sort((first, second) => first.dayIndex - second.dayIndex || first.time - second.time);
    const firstSlot = sortedSlots[0];
    const sameDaySlots = sortedSlots.filter((slot) => slot.dayIndex === firstSlot.dayIndex);
    const startTime = Math.min(...sameDaySlots.map((slot) => slot.time));
    const endTime = Math.max(...sameDaySlots.map((slot) => slot.time)) + 0.5;
    const date = getCurrentWeekDates()[firstSlot.dayIndex];

    return {
        startAt: toLocalDateTimeString(date, startTime),
        endAt: toLocalDateTimeString(date, endTime),
    };
}

function getCurrentWeekDates() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return date;
    });
}

function toLocalDateTimeString(date: Date, time: number) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(Math.floor(time) % 24).padStart(2, '0');
    const minute = time % 1 === 0 ? '00' : '30';

    return `${year}-${month}-${day}T${hour}:${minute}:00`;
}
