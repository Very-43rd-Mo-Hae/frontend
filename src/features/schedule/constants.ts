import type { EditableSlotStatus, ScheduledBlock, SlotStatus } from '@/features/schedule/types';

export const weekDayLabels = ['월', '화', '수', '목', '금', '토', '일'];

export const hours = Array.from({ length: 16 }, (_, index) => index + 8);
export const scheduleTimeSlots = Array.from({ length: 32 }, (_, index) => 8 + index * 0.5);

export const editableStatusOrder: EditableSlotStatus[] = ['available', 'adjustable', 'unavailable'];

export const statusConfig: Record<
    SlotStatus,
    {
        label: string;
        cellClassName: string;
        textClassName: string;
    }
> = {
    available: {
        label: '가능',
        cellClassName: 'bg-relink-scheduleGreen',
        textClassName: 'text-relink-ink',
    },
    adjustable: {
        label: '조율',
        cellClassName: 'bg-relink-scheduleYellow',
        textClassName: 'text-relink-ink',
    },
    unavailable: {
        label: '불가',
        cellClassName: 'bg-relink-schedulePink',
        textClassName: 'text-relink-ink',
    },
    scheduled: {
        label: '스케줄',
        cellClassName: 'bg-relink-lavender-intense',
        textClassName: 'text-relink-white',
    },
};

export const scheduledBlocks: ScheduledBlock[] = [
    { dayIndex: 1, startHour: 9, endHour: 11, title: '스케줄 제목', location: '장소' },
    { dayIndex: 2, startHour: 11, endHour: 13, title: '스케줄 제목', location: '장소' },
    {
        dayIndex: 3,
        startHour: 19,
        endHour: 22,
        title: '성민 학생 과외',
        location: '수원시 이의동',
        memo: '오늘은 10분 빨리 도착하기!',
    },
    { dayIndex: 4, startHour: 15, endHour: 17, title: '다가오는 약속 제목', location: '장소' },
    { dayIndex: 5, startHour: 13, endHour: 16, title: '스케줄 제목', location: '장소' },
];
