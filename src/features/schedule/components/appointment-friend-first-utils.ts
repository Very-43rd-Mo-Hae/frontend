import { previewDates, type FriendCalendarPreviewBlock } from '@/components/common/friend-calendar-preview-modal';
import { getPreviewSlotStatus } from '@/features/schedule/components/appointment-calendar-utils';
import type { AvailabilitySegmentStatus } from '@/features/schedule/components/appointment-friend-types';
import { weekDayLabels } from '@/features/schedule/constants';

export type FriendFirstStep = 'friends' | 'time' | 'review';

export type TimeSlot = {
    dayIndex: number;
    time: number;
};

export const statusClassNames: Record<AvailabilitySegmentStatus, string> = {
    available: 'bg-relink-scheduleGreen',
    adjustable: 'bg-relink-scheduleYellow',
    unavailable: 'bg-relink-schedulePink',
    lightning: 'bg-relink-cyan',
    empty: 'bg-relink-lavender-middle/55',
};

export const halfHourTimes = Array.from({ length: 32 }, (_, index) => 8 + index * 0.5);
export const unselectableStatuses = new Set(['scheduled', 'unavailable']);

export function isSelectablePreviewSlot(slot: TimeSlot, blocks?: FriendCalendarPreviewBlock[]) {
    const status = getPreviewSlotStatus(blocks, slot.dayIndex, slot.time);

    return Boolean(status && !unselectableStatuses.has(status));
}

export function getTimeSlotKey(dayIndex: number, time: number) {
    return `${dayIndex}-${time}`;
}

export function getOverlapSlotRow(time: number) {
    return 2 + Math.round((time - 8) * 2);
}

export function formatSelectedTimeLabel(slots: TimeSlot[]) {
    const sortedSlots = [...slots].sort((first, second) => first.dayIndex - second.dayIndex || first.time - second.time);
    const firstSlot = sortedSlots[0];
    const sameDaySlots = sortedSlots.filter((slot) => slot.dayIndex === firstSlot.dayIndex);
    const startTime = Math.min(...sameDaySlots.map((slot) => slot.time));
    const endTime = Math.max(...sameDaySlots.map((slot) => slot.time)) + 0.5;

    return `${previewDates[firstSlot.dayIndex]}일 (${weekDayLabels[firstSlot.dayIndex]}) ${formatPreviewTime(startTime)} ~ ${formatPreviewTime(endTime)}`;
}

export function formatPreviewTime(time: number) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0 ? '00' : '30';

    return `${String(hour).padStart(2, '0')}:${minute}`;
}
