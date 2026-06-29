import type { PointerEvent } from 'react';

import { hours, scheduleTimeSlots, statusConfig, weekDayLabels } from '@/features/schedule/constants';
import { getSlotKey } from '@/features/schedule/schedule-utils';
import type { EditableSlotStatus, ScheduledBlock, SlotStatus } from '@/features/schedule/types';

type ScheduleGridProps = {
    weekDates: Date[];
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    selectedSlotKeys: Set<string>;
    onSlotClick: (dayIndex: number, time: number) => void;
    onSlotPointerDown: (dayIndex: number, time: number, event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onScheduledBlockClick: (scheduledBlock: ScheduledBlock) => void;
};

export function ScheduleGrid({
    weekDates,
    slotStatuses,
    scheduledSlotMap,
    selectedSlotKeys,
    onSlotClick,
    onSlotPointerDown,
    onSlotPointerMove,
    onSlotPointerUp,
    onScheduledBlockClick,
}: ScheduleGridProps) {
    return (
        <section
            className="rounded bg-relink-white px-3 pb-4 pt-3 shadow-relink-card"
            style={{ height: 'min(720px, calc(100dvh - 290px))', minHeight: 600 }}
        >
            <div
                className="grid h-full gap-x-1"
                style={{
                    gridTemplateColumns: '26px repeat(7, minmax(0, 1fr))',
                    gridTemplateRows: '34px repeat(32, minmax(0, 1fr))',
                }}
            >
                <div aria-hidden="true" />
                {weekDates.map((date, index) => (
                    <div key={date.toISOString()} className="flex items-center justify-center gap-1">
                        <span className="text-sm text-relink-ink">{weekDayLabels[index]}</span>
                        <span className="text-[11px] text-relink-gray-400">{date.getDate()}</span>
                    </div>
                ))}

                {hours.map((hour) => (
                    <div
                        key={hour}
                        className="col-start-1 flex items-start justify-center pt-1 text-md text-relink-ink"
                        style={{ gridRow: `${getSlotRow(hour)} / span 2` }}
                    >
                        {hour}
                    </div>
                ))}

                {Array.from({ length: 7 }, (_, dayIndex) =>
                    scheduleTimeSlots.map((time) => (
                        <ScheduleSlotCell
                            key={getSlotKey(dayIndex, time)}
                            dayIndex={dayIndex}
                            time={time}
                            slotStatuses={slotStatuses}
                            scheduledSlotMap={scheduledSlotMap}
                            selectedSlotKeys={selectedSlotKeys}
                            onSlotClick={onSlotClick}
                            onSlotPointerDown={onSlotPointerDown}
                            onSlotPointerMove={onSlotPointerMove}
                            onSlotPointerUp={onSlotPointerUp}
                            onScheduledBlockClick={onScheduledBlockClick}
                        />
                    )),
                )}
            </div>
        </section>
    );
}

function ScheduleSlotCell({
    dayIndex,
    time,
    slotStatuses,
    scheduledSlotMap,
    selectedSlotKeys,
    onSlotClick,
    onSlotPointerDown,
    onSlotPointerMove,
    onSlotPointerUp,
    onScheduledBlockClick,
}: {
    dayIndex: number;
    time: number;
    slotStatuses: Record<string, EditableSlotStatus>;
    scheduledSlotMap: Map<string, ScheduledBlock>;
    selectedSlotKeys: Set<string>;
    onSlotClick: (dayIndex: number, time: number) => void;
    onSlotPointerDown: (dayIndex: number, time: number, event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
    onSlotPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onScheduledBlockClick: (scheduledBlock: ScheduledBlock) => void;
}) {
    const slotKey = getSlotKey(dayIndex, time);
    const currentCell = getCellState(dayIndex, time, slotStatuses, scheduledSlotMap);

    if (!currentCell) {
        return null;
    }

    const { scheduledBlock, status } = currentCell;
    const previousCell = getCellState(dayIndex, time - 0.5, slotStatuses, scheduledSlotMap);
    const nextCell = getCellState(dayIndex, time + 0.5, slotStatuses, scheduledSlotMap);
    const connectsToPrevious = isConnectedCell(status, scheduledBlock, previousCell);
    const connectsToNext = isConnectedCell(status, scheduledBlock, nextCell);
    const isBlockStart = scheduledBlock?.startHour === time;
    const radiusClassName = [
        connectsToPrevious ? 'mt-0 rounded-t-none' : 'mt-0.5 rounded-t',
        connectsToNext ? 'mb-0 rounded-b-none' : 'mb-0.5 rounded-b',
    ].join(' ');
    const selectedClassName = selectedSlotKeys.has(slotKey) ? 'z-10 ring-2 ring-relink-ink/40 ring-inset' : '';

    return (
        <button
            type="button"
            data-day-index={dayIndex}
            data-time={time}
            onPointerDown={(event) => {
                if (!scheduledBlock) {
                    onSlotPointerDown(dayIndex, time, event);
                }
            }}
            onPointerMove={onSlotPointerMove}
            onPointerUp={onSlotPointerUp}
            onClick={() => {
                if (scheduledBlock) {
                    onScheduledBlockClick(scheduledBlock);
                    return;
                }

                onSlotClick(dayIndex, time);
            }}
            className={`relative min-h-0 w-full touch-none transition-transform active:scale-95 ${radiusClassName} ${selectedClassName} ${statusConfig[status].cellClassName}`}
            style={{
                gridColumn: dayIndex + 2,
                gridRow: getSlotRow(time),
            }}
            aria-label={`${weekDayLabels[dayIndex]}요일 ${formatTime(time)} ${statusConfig[status].label}`}
        >
            {isBlockStart ? (
                <span
                    className={`absolute left-1 top-1 max-w-[calc(100%-8px)] text-left text-[9px] leading-[11px] ${statusConfig[status].textClassName}`}
                >
                    <span className="block truncate">{scheduledBlock.title}</span>
                    <span className="block truncate">{scheduledBlock.location}</span>
                </span>
            ) : null}
        </button>
    );
}

function getCellState(
    dayIndex: number,
    time: number,
    slotStatuses: Record<string, EditableSlotStatus>,
    scheduledSlotMap: Map<string, ScheduledBlock>,
): ScheduleCellState | null {
    if (!scheduleTimeSlots.includes(time)) {
        return null;
    }

    const slotKey = getSlotKey(dayIndex, time);
    const scheduledBlock = scheduledSlotMap.get(slotKey);

    return {
        scheduledBlock,
        status: scheduledBlock ? 'scheduled' : (slotStatuses[slotKey] ?? 'available'),
    };
}

type ScheduleCellState = {
    scheduledBlock?: ScheduledBlock;
    status: SlotStatus;
};

function isConnectedCell(
    status: SlotStatus,
    scheduledBlock: ScheduledBlock | undefined,
    adjacentCell: ScheduleCellState | null,
) {
    if (!adjacentCell || adjacentCell.status !== status) {
        return false;
    }

    if (status === 'scheduled') {
        return adjacentCell.scheduledBlock === scheduledBlock;
    }

    return true;
}

function getSlotRow(time: number) {
    return 2 + Math.round((time - 8) * 2);
}

function formatTime(time: number) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0 ? '00' : '30';

    return `${String(hour).padStart(2, '0')}:${minute}`;
}
