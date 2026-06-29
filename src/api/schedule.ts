import apiClient from '@/lib/api-client';

import type { EditableSlotStatus, ScheduledBlock } from '@/features/schedule/types';

type ApiSlotStatus = 'UNAVAILABLE' | 'NEGOTIABLE' | 'AVAILABLE' | 'APPOINTMENT';

type WeeklyScheduleResponse = {
    weekStartDate: string;
    weekEndDate: string;
    days: DailyScheduleResponse[];
};

type DailyScheduleResponse = {
    date: string;
    slots: ScheduleSlotResponse[];
};

type ScheduleSlotResponse = {
    startTime: string;
    endTime: string;
    status: ApiSlotStatus;
    appointmentId: number | null;
};

type UpdateScheduleSlotsResponse = {
    weekStartDate: string;
    slots: ScheduleSlotChangeResponse[];
};

type ScheduleSlotChangeResponse = {
    date: string;
    startTime: string;
    endTime: string;
    status: ApiSlotStatus;
};

type UpdateScheduleSlotRequest = {
    scheduleDate: string;
    startTime: string;
    endTime: string;
    status: ApiSlotStatus;
};

export type ScheduleState = {
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
};

const editableStatusByApiStatus: Partial<Record<ApiSlotStatus, EditableSlotStatus>> = {
    AVAILABLE: 'available',
    NEGOTIABLE: 'adjustable',
    UNAVAILABLE: 'unavailable',
};

const apiStatusByEditableStatus: Record<EditableSlotStatus, ApiSlotStatus> = {
    available: 'AVAILABLE',
    adjustable: 'NEGOTIABLE',
    unavailable: 'UNAVAILABLE',
};

export async function fetchWeeklySchedule(date: Date) {
    const response = await apiClient.get<WeeklyScheduleResponse>('/schedules/week', {
        params: { date: formatDate(date) },
    });

    return toScheduleState(response);
}

export async function updateScheduleSlots(slotKeys: string[], status: EditableSlotStatus, weekDates: Date[]) {
    const slots = slotKeys.map<UpdateScheduleSlotRequest>((slotKey) => {
        const { dayIndex, time } = parseSlotKey(slotKey);

        return {
            scheduleDate: formatDate(weekDates[dayIndex]),
            startTime: formatTime(time),
            endTime: formatTime(time + 0.5),
            status: apiStatusByEditableStatus[status],
        };
    });

    const response = await apiClient.patch<UpdateScheduleSlotsResponse, { slots: UpdateScheduleSlotRequest[] }>(
        '/schedules/slots',
        { slots },
    );

    return response.slots.reduce<Record<string, EditableSlotStatus>>((changes, slot) => {
        const dayIndex = getDayIndex(slot.date, weekDates);
        const time = parseTimeValue(slot.startTime);
        const nextStatus = editableStatusByApiStatus[slot.status];

        if (dayIndex >= 0 && nextStatus && isHalfHour(slot.startTime)) {
            changes[`${dayIndex}-${time}`] = nextStatus;
        }

        return changes;
    }, {});
}

function toScheduleState(response: WeeklyScheduleResponse): ScheduleState {
    const weekDates = response.days.map((day) => parseDate(day.date));
    const slotStatuses: Record<string, EditableSlotStatus> = {};
    const scheduledSlotMap = new Map<string, ScheduledBlock>();

    response.days.forEach((day, dayIndex) => {
        const appointmentSlots = new Map<number, number[]>();

        day.slots.forEach((slot) => {
            if (!isHalfHour(slot.startTime)) {
                return;
            }

            const time = parseTimeValue(slot.startTime);
            const slotKey = `${dayIndex}-${time}`;

            if (slot.status === 'APPOINTMENT') {
                const appointmentKey = slot.appointmentId ?? time;
                appointmentSlots.set(appointmentKey, [...(appointmentSlots.get(appointmentKey) ?? []), time]);
                return;
            }

            const editableStatus = editableStatusByApiStatus[slot.status];
            if (editableStatus) {
                slotStatuses[slotKey] = editableStatus;
            }
        });

        appointmentSlots.forEach((appointmentTimes, appointmentId) => {
            const sortedTimes = [...appointmentTimes].sort((first, second) => first - second);
            let blockStart = sortedTimes[0];
            let previousTime = sortedTimes[0];

            for (let index = 1; index <= sortedTimes.length; index += 1) {
                const currentTime = sortedTimes[index];
                if (currentTime === previousTime + 0.5) {
                    previousTime = currentTime;
                    continue;
                }

                const block = createScheduledBlock(dayIndex, blockStart, previousTime + 0.5, appointmentId, weekDates);
                for (let time = block.startHour; time < block.endHour; time += 0.5) {
                    scheduledSlotMap.set(`${dayIndex}-${time}`, block);
                }

                blockStart = currentTime;
                previousTime = currentTime;
            }
        });
    });

    return { slotStatuses, scheduledSlotMap };
}

function createScheduledBlock(
    dayIndex: number,
    startHour: number,
    endHour: number,
    appointmentId: number,
    weekDates: Date[],
): ScheduledBlock {
    return {
        dayIndex,
        startHour,
        endHour,
        title: 'Appointment',
        location: '',
        memo: `${formatDate(weekDates[dayIndex])} appointment #${appointmentId}`,
    };
}

function getDayIndex(date: string, weekDates: Date[]) {
    return weekDates.findIndex((weekDate) => formatDate(weekDate) === date);
}

function parseSlotKey(slotKey: string) {
    const [dayIndex, time] = slotKey.split('-').map(Number);
    return { dayIndex, time };
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function parseDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function formatTime(time: number) {
    const normalizedTime = time % 24;
    const hour = Math.floor(normalizedTime);
    const minute = normalizedTime % 1 === 0 ? '00' : '30';

    return `${String(hour).padStart(2, '0')}:${minute}:00`;
}

function isHalfHour(time: string) {
    const { minute } = parseTime(time);

    return minute === 0 || minute === 30;
}

function parseTimeValue(time: string) {
    const { hour, minute } = parseTime(time);

    return hour + minute / 60;
}

function parseTime(time: string) {
    const [hour = '0', minute = '0'] = time.split(':');

    return {
        hour: Number(hour),
        minute: Number(minute),
    };
}
