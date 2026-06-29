import { scheduleTimeSlots, scheduledBlocks, weekDayLabels } from '@/features/schedule/constants';
import type { EditableSlotStatus, ScheduledBlock } from '@/features/schedule/types';

export function createInitialSlotStatuses() {
    return scheduleTimeSlots.reduce<Record<string, EditableSlotStatus>>((statuses, time) => {
        weekDayLabels.forEach((_, dayIndex) => {
            const statusSeed = (dayIndex * 3 + time * 2) % 9;
            const slotKey = getSlotKey(dayIndex, time);

            statuses[slotKey] =
                statusSeed === 0 || statusSeed === 5
                    ? 'unavailable'
                    : statusSeed === 2
                      ? 'adjustable'
                      : 'available';
        });

        return statuses;
    }, {});
}

export function createScheduledSlotMap() {
    return scheduledBlocks.reduce<Map<string, ScheduledBlock>>((slotMap, block) => {
        for (let time = block.startHour; time < block.endHour; time += 0.5) {
            slotMap.set(getSlotKey(block.dayIndex, time), block);
        }

        return slotMap;
    }, new Map());
}

export function getSlotKey(dayIndex: number, time: number) {
    return `${dayIndex}-${time}`;
}

export function getWeekDates(date: Date) {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const mondayOffset = (dateOnly.getDay() + 6) % 7;
    const monday = addDays(dateOnly, -mondayOffset);

    return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function addDays(date: Date, days: number) {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + days);
    return nextDate;
}

export function formatWeekTitle(weekDates: Date[]) {
    const firstDate = weekDates[0];
    const lastDate = weekDates[6];
    const year = firstDate.getFullYear();
    const month = `${firstDate.getMonth() + 1}`.padStart(2, '0');
    const firstDay = `${firstDate.getDate()}`.padStart(2, '0');
    const lastDay = `${lastDate.getDate()}`.padStart(2, '0');

    return `${year}년 ${month}월 ${firstDay}일 ~ ${lastDay}일`;
}
