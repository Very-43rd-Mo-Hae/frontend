import type { PointerEvent } from 'react';

import {
    multipleStatusClassNames,
    previewDates,
    type FriendCalendarPreviewBlock,
} from '@/components/common/friend-calendar-preview-modal';
import { getPreviewSlotStatus } from '@/features/schedule/components/appointment-calendar-utils';
import {
    formatPreviewTime,
    getOverlapSlotRow,
    getTimeSlotKey,
    halfHourTimes,
    type TimeSlot,
    unselectableStatuses,
} from '@/features/schedule/components/appointment-friend-first-utils';
import { hours, weekDayLabels } from '@/features/schedule/constants';

type OverlapCalendarGridProps = {
    blocks?: FriendCalendarPreviewBlock[];
    selectedSlotKeys: Set<string>;
    onSlotPointerDown: (slot: TimeSlot, event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function OverlapCalendarGrid({
    blocks,
    selectedSlotKeys,
    onSlotPointerDown,
    onSlotPointerMove,
}: OverlapCalendarGridProps) {
    return (
        <section
            className="grid h-[390px] gap-x-1"
            style={{
                gridTemplateColumns: '28px repeat(7, minmax(0, 1fr))',
                gridTemplateRows: '34px repeat(32, minmax(0, 1fr))',
            }}
        >
            <div aria-hidden="true" />
            {weekDayLabels.map((label, index) => (
                <div key={label} className="flex items-center justify-center gap-1">
                    <span className="text-sm text-relink-ink">{label}</span>
                    <span className="text-sm text-relink-gray-400">{previewDates[index]}</span>
                </div>
            ))}

            {hours.map((hour) => (
                <div
                    key={hour}
                    className="col-start-1 flex items-start justify-center pt-0.5 text-md text-relink-ink"
                    style={{ gridRow: `${getOverlapSlotRow(hour)} / span 2` }}
                >
                    {hour}
                </div>
            ))}

            {Array.from({ length: 7 }, (_, dayIndex) =>
                halfHourTimes.map((time) => {
                    const status = getPreviewSlotStatus(blocks, dayIndex, time);
                    const slotKey = getTimeSlotKey(dayIndex, time);

                    if (!status) {
                        return null;
                    }

                    const previousStatus = getPreviewSlotStatus(blocks, dayIndex, time - 0.5);
                    const nextStatus = getPreviewSlotStatus(blocks, dayIndex, time + 0.5);
                    const selectedClassName = selectedSlotKeys.has(slotKey)
                        ? 'z-10 ring-2 ring-relink-lavender-intense ring-inset'
                        : '';

                    return (
                        <button
                            key={slotKey}
                            type="button"
                            data-day-index={dayIndex}
                            data-time={time}
                            className={`touch-none ${multipleStatusClassNames[status]} ${selectedClassName} ${
                                previousStatus === status ? 'rounded-t-none' : 'mt-0.5 rounded-t'
                            } ${nextStatus === status ? 'rounded-b-none' : 'mb-0.5 rounded-b'} ${
                                unselectableStatuses.has(status) ? 'cursor-not-allowed' : ''
                            }`}
                            style={{
                                gridColumn: dayIndex + 2,
                                gridRow: getOverlapSlotRow(time),
                            }}
                            onPointerDown={(event) => onSlotPointerDown({ dayIndex, time }, event)}
                            onPointerMove={onSlotPointerMove}
                            aria-label={`${weekDayLabels[dayIndex]}요일 ${formatPreviewTime(time)}`}
                        />
                    );
                }),
            )}
        </section>
    );
}
