import type {
    FriendCalendarPreviewBlock,
    PreviewSlotStatus,
} from '@/components/common/friend-calendar-preview-modal';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

export function toCalendarPreviewBlocks(friends: AppointmentFriend[]) {
    const calendars = friends.flatMap((friend) => (friend.calendar ? [friend.calendar] : []));
    if (calendars.length === 0) {
        return undefined;
    }

    const slotStatusMap = new Map<string, PreviewSlotStatus[]>();
    for (const calendar of calendars) {
        const weekStart = parseDate(calendar.weekStartDate);
        calendar.days.forEach((day) => {
            const dayIndex = Math.round((parseDate(day.date).getTime() - weekStart.getTime()) / 86_400_000);
            day.slots.forEach((slot) => {
                const start = parseTimeValue(slot.startTime);
                const end = parseTimeValue(slot.endTime);
                if (dayIndex < 0 || dayIndex > 6 || start < 8 || start >= 24) {
                    return;
                }

                const key = `${dayIndex}-${start}-${end}`;
                slotStatusMap.set(key, [...(slotStatusMap.get(key) ?? []), toPreviewSlotStatus(slot.status)]);
            });
        });
    }

    return mergePreviewBlocks(
        [...slotStatusMap.entries()].map(([key, statuses]) => {
            const [dayIndex, start, end] = key.split('-').map(Number);

            return {
                dayIndex,
                start,
                end,
                status: combineStatuses(statuses),
            };
        }),
    );
}

export function getPreviewSlotStatus(
    blocks: FriendCalendarPreviewBlock[] | undefined,
    dayIndex: number,
    time: number,
) {
    return blocks?.find((block) => block.dayIndex === dayIndex && block.start <= time && time < block.end)?.status;
}

function mergePreviewBlocks(blocks: FriendCalendarPreviewBlock[]) {
    return blocks
        .sort((first, second) => first.dayIndex - second.dayIndex || first.start - second.start)
        .reduce<FriendCalendarPreviewBlock[]>((merged, block) => {
            const previous = merged[merged.length - 1];
            if (previous && previous.dayIndex === block.dayIndex && previous.status === block.status && previous.end === block.start) {
                previous.end = block.end;
                return merged;
            }

            return [...merged, { ...block }];
        }, []);
}

function combineStatuses(statuses: PreviewSlotStatus[]): PreviewSlotStatus {
    if (statuses.includes('scheduled')) {
        return 'scheduled';
    }
    if (statuses.includes('unavailable')) {
        return 'unavailable';
    }
    if (statuses.includes('adjustable')) {
        return 'adjustable';
    }
    return 'available';
}

function toPreviewSlotStatus(status: string): PreviewSlotStatus {
    switch (status) {
        case 'APPOINTMENT':
            return 'scheduled';
        case 'UNAVAILABLE':
            return 'unavailable';
        case 'NEGOTIABLE':
            return 'adjustable';
        case 'AVAILABLE':
        default:
            return 'available';
    }
}

function parseDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function parseTimeValue(time: string) {
    const [hour = '0', minute = '0'] = time.split(':');

    return Number(hour) + Number(minute) / 60;
}
