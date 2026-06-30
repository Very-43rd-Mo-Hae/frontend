import { FriendCalendarPreviewModal } from '@/components/common/friend-calendar-preview-modal';
import { toCalendarPreviewBlocks } from '@/features/schedule/components/appointment-calendar-utils';
import { AppointmentFriendFirstHeader } from '@/features/schedule/components/appointment-friend-first-header';
import { AppointmentFriendFirstList } from '@/features/schedule/components/appointment-friend-first-list';
import { AppointmentFriendFirstNextButton } from '@/features/schedule/components/appointment-friend-first-next-button';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentFriendFirstSelectionScreenProps = {
    friends: AppointmentFriend[];
    selectedFriendNames: string[];
    calendarPreviewName: string | null;
    onFriendToggle: (friendName: string) => void;
    onCalendarOpen: (friendName: string) => void;
    onCalendarClose: () => void;
    onNext: () => void;
};

export function AppointmentFriendFirstSelectionScreen({
    friends,
    selectedFriendNames,
    calendarPreviewName,
    onFriendToggle,
    onCalendarOpen,
    onCalendarClose,
    onNext,
}: AppointmentFriendFirstSelectionScreenProps) {
    const calendarPreviewBlocks = calendarPreviewName
        ? toCalendarPreviewBlocks(friends.filter((friend) => friend.name === calendarPreviewName))
        : undefined;

    return (
        <main className="relative flex h-full min-h-0 flex-col bg-relink-white px-5 pt-10 font-display">
            <AppointmentFriendFirstHeader />
            <AppointmentFriendFirstList
                friends={friends}
                selectedFriendNames={selectedFriendNames}
                onFriendToggle={onFriendToggle}
                onCalendarOpen={onCalendarOpen}
            />
            <AppointmentFriendFirstNextButton selectedCount={selectedFriendNames.length} onNext={onNext} />

            {calendarPreviewName ? (
                <FriendCalendarPreviewModal
                    friendNames={[calendarPreviewName]}
                    blocks={calendarPreviewBlocks}
                    onClose={onCalendarClose}
                />
            ) : null}
        </main>
    );
}
