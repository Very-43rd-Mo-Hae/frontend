import { useMemo, useState } from 'react';

import { FloatingAddButton } from '@/components/common/floating-add-button';
import { editableStatusOrder } from '@/features/schedule/constants';
import { ScheduleGrid } from '@/features/schedule/components/schedule-grid';
import { ScheduleHeader } from '@/features/schedule/components/schedule-header';
import { WeekNavigator } from '@/features/schedule/components/week-navigator';
import {
    addDays,
    createInitialSlotStatuses,
    createScheduledSlotMap,
    formatWeekTitle,
    getSlotKey,
    getWeekDates,
} from '@/features/schedule/schedule-utils';
import type { EditableSlotStatus } from '@/features/schedule/types';

export function ScheduleSelectionView() {
    const [baseDate, setBaseDate] = useState(() => new Date());
    const [slotStatuses, setSlotStatuses] = useState<Record<string, EditableSlotStatus>>(() =>
        createInitialSlotStatuses(),
    );

    const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);
    const weekTitle = useMemo(() => formatWeekTitle(weekDates), [weekDates]);
    const scheduledSlotMap = useMemo(() => createScheduledSlotMap(), []);

    const changeWeek = (weekOffset: number) => {
        setBaseDate((current) => addDays(current, weekOffset * 7));
    };

    const handleSlotClick = (dayIndex: number, hour: number) => {
        const slotKey = getSlotKey(dayIndex, hour);

        if (scheduledSlotMap.has(slotKey)) {
            return;
        }

        setSlotStatuses((current) => {
            const currentStatus = current[slotKey] ?? 'available';
            const currentIndex = editableStatusOrder.indexOf(currentStatus);
            const nextStatus = editableStatusOrder[(currentIndex + 1) % editableStatusOrder.length];

            return {
                ...current,
                [slotKey]: nextStatus,
            };
        });
    };

    return (
        <div className="relative flex h-full min-h-0 flex-col gap-5 bg-relink-white px-5 pt-10 font-display">
            <ScheduleHeader />

            <main className="relink-hidden-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 pb-2">
                <WeekNavigator
                    title={weekTitle}
                    onPreviousWeek={() => changeWeek(-1)}
                    onNextWeek={() => changeWeek(1)}
                />
                <ScheduleGrid
                    weekDates={weekDates}
                    slotStatuses={slotStatuses}
                    scheduledSlotMap={scheduledSlotMap}
                    onSlotClick={handleSlotClick}
                />
                <FloatingAddButton placement="inline" />
            </main>
        </div>
    );
}
