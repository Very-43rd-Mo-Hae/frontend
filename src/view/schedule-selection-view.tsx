import type { PointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';
import { AppointmentProposalReview } from '@/features/schedule/components/appointment-proposal-review';
import {
    ScheduleSelectionScreen,
    type StatusChangeMenuState,
} from '@/features/schedule/components/schedule-selection-screen';
import { editableStatusOrder } from '@/features/schedule/constants';
import {
    fetchWeeklySchedule,
    updateScheduleSlots,
    type ScheduleState,
} from '@/api/schedule';
import {
    addDays,
    formatWeekTitle,
    getSlotKey,
    getWeekDates,
} from '@/features/schedule/schedule-utils';
import type { AppointmentSelection, EditableSlotStatus, ScheduledBlock } from '@/features/schedule/types';

type DragSelection = {
    anchorStatus: EditableSlotStatus;
    slotKeys: string[];
    hasMoved: boolean;
};

type AppointmentProposalState = {
    selection: AppointmentSelection;
    selectedFriends: AppointmentFriend[];
};

type ScheduleSelectionViewProps = {
    title?: string;
    showFloatingAction?: boolean;
    mode?: 'calendar' | 'appointment';
};

export function ScheduleSelectionView({
    title = '캘린더',
    showFloatingAction = true,
    mode = 'calendar',
}: ScheduleSelectionViewProps) {
    const [baseDate, setBaseDate] = useState(() => new Date());
    const [scheduleState, setScheduleState] = useState<ScheduleState>(() => ({
        slotStatuses: {},
        scheduledSlotMap: new Map(),
    }));
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduledBlock | null>(null);
    const [appointmentSelection, setAppointmentSelection] = useState<AppointmentSelection | null>(null);
    const [appointmentProposal, setAppointmentProposal] = useState<AppointmentProposalState | null>(null);
    const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);
    const [statusChangeMenu, setStatusChangeMenu] = useState<StatusChangeMenuState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const dragSelectionRef = useRef<DragSelection | null>(null);
    const suppressNextClickRef = useRef(false);

    const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate]);
    const weekTitle = useMemo(() => formatWeekTitle(weekDates), [weekDates]);
    const { slotStatuses, scheduledSlotMap } = scheduleState;
    const selectedSlotKeys = useMemo(
        () => new Set(statusChangeMenu?.slotKeys ?? dragSelection?.slotKeys ?? appointmentSelection?.slotKeys ?? []),
        [appointmentSelection, dragSelection, statusChangeMenu],
    );

    const changeWeek = (weekOffset: number) => {
        setBaseDate((current) => addDays(current, weekOffset * 7));
    };

    useEffect(() => {
        let ignore = false;

        setIsLoading(true);
        setStatusChangeMenu(null);
        setSelectedSchedule(null);
        setAppointmentSelection(null);

        fetchWeeklySchedule(baseDate)
            .then((nextScheduleState) => {
                if (!ignore) {
                    setScheduleState(nextScheduleState);
                }
            })
            .catch(() => {
                if (!ignore) {
                    setScheduleState({
                        slotStatuses: {},
                        scheduledSlotMap: new Map(),
                    });
                }
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [baseDate]);

    const updateDragSelection = (nextSelection: DragSelection | null) => {
        dragSelectionRef.current = nextSelection;
        setDragSelection(nextSelection);
    };

    const handleSlotClick = async (dayIndex: number, time: number) => {
        if (mode === 'appointment' || isSaving) {
            return;
        }

        if (suppressNextClickRef.current) {
            suppressNextClickRef.current = false;
            return;
        }

        const slotKey = getSlotKey(dayIndex, time);
        const currentStatus = slotStatuses[slotKey] ?? 'available';
        const currentIndex = editableStatusOrder.indexOf(currentStatus);
        const nextStatus = editableStatusOrder[(currentIndex + 1) % editableStatusOrder.length];

        await saveSlotStatusChanges([slotKey], nextStatus);
    };

    const handleSlotPointerDown = (
        dayIndex: number,
        time: number,
        event: PointerEvent<HTMLButtonElement>,
    ) => {
        if (event.button !== 0 || scheduledSlotMap.has(getSlotKey(dayIndex, time))) {
            return;
        }

        const slotKey = getSlotKey(dayIndex, time);
        const anchorStatus = slotStatuses[slotKey] ?? 'available';

        if (mode === 'appointment' && !isAppointmentSelectableStatus(anchorStatus)) {
            return;
        }

        setStatusChangeMenu(null);
        updateDragSelection({
            anchorStatus,
            slotKeys: [slotKey],
            hasMoved: false,
        });
    };

    const handleSlotPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
        const currentSelection = dragSelectionRef.current;

        if (!currentSelection || event.buttons !== 1) {
            return;
        }

        const target = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest<HTMLButtonElement>('[data-day-index][data-time]');

        if (!target) {
            return;
        }

        const dayIndex = Number(target.dataset.dayIndex);
        const time = Number(target.dataset.time);
        const slotKey = getSlotKey(dayIndex, time);
        const slotStatus = slotStatuses[slotKey] ?? 'available';

        if (scheduledSlotMap.has(slotKey)) {
            return;
        }

        if (mode === 'appointment' && !isAppointmentSelectableStatus(slotStatus)) {
            return;
        }

        if (mode === 'calendar' && slotStatus !== currentSelection.anchorStatus) {
            return;
        }

        if (currentSelection.slotKeys.includes(slotKey)) {
            return;
        }

        updateDragSelection({
            ...currentSelection,
            slotKeys: [...currentSelection.slotKeys, slotKey],
            hasMoved: true,
        });
    };

    const handleSlotPointerUp = (event: PointerEvent<HTMLElement>) => {
        const currentSelection = dragSelectionRef.current;

        if (!currentSelection) {
            return;
        }

        if (mode === 'appointment') {
            if (currentSelection.hasMoved && currentSelection.slotKeys.length > 1) {
                setAppointmentSelection({
                    slotKeys: currentSelection.slotKeys,
                    label: formatAppointmentSelectionLabel(currentSelection.slotKeys, weekDates),
                });
            }

            updateDragSelection(null);
            return;
        }

        if (currentSelection.hasMoved && currentSelection.slotKeys.length > 1) {
            suppressNextClickRef.current = true;
            setStatusChangeMenu({
                currentStatus: currentSelection.anchorStatus,
                slotKeys: currentSelection.slotKeys,
                position: {
                    x: Math.max(12, Math.min(event.clientX, window.innerWidth - 132)),
                    y: Math.max(12, Math.min(event.clientY + 10, window.innerHeight - 140)),
                },
            });
        }

        updateDragSelection(null);
    };

    const changeSelectedSlotsStatus = async (nextStatus: EditableSlotStatus) => {
        if (!statusChangeMenu || isSaving) {
            return;
        }

        await saveSlotStatusChanges(statusChangeMenu.slotKeys, nextStatus);
        setStatusChangeMenu(null);
    };

    const saveSlotStatusChanges = async (slotKeys: string[], nextStatus: EditableSlotStatus) => {
        setIsSaving(true);

        try {
            const changedStatuses = await updateScheduleSlots(slotKeys, nextStatus, weekDates);
            setScheduleState((current) => ({
                ...current,
                slotStatuses: {
                    ...current.slotStatuses,
                    ...changedStatuses,
                },
            }));
        } catch {
            return;
        } finally {
            setIsSaving(false);
        }
    };

    if (appointmentProposal) {
        return (
            <AppointmentProposalReview
                selection={appointmentProposal.selection}
                selectedFriends={appointmentProposal.selectedFriends}
                onBack={() => setAppointmentProposal(null)}
            />
        );
    }

    return (
        <ScheduleSelectionScreen
            title={title}
            weekTitle={weekTitle}
            weekDates={weekDates}
            slotStatuses={slotStatuses}
            scheduledSlotMap={scheduledSlotMap}
            selectedSlotKeys={selectedSlotKeys}
            showFloatingAction={showFloatingAction}
            statusChangeMenu={statusChangeMenu}
            selectedSchedule={selectedSchedule}
            appointmentSelection={appointmentSelection}
            isLoading={isLoading}
            isSaving={isSaving}
            onPointerCancel={() => updateDragSelection(null)}
            onPointerUp={handleSlotPointerUp}
            onPreviousWeek={() => changeWeek(-1)}
            onNextWeek={() => changeWeek(1)}
            onSlotClick={handleSlotClick}
            onSlotPointerDown={handleSlotPointerDown}
            onSlotPointerMove={handleSlotPointerMove}
            onSlotPointerUp={handleSlotPointerUp}
            onScheduledBlockClick={setSelectedSchedule}
            onStatusSelect={changeSelectedSlotsStatus}
            onStatusMenuClose={() => setStatusChangeMenu(null)}
            onScheduleModalClose={() => setSelectedSchedule(null)}
            onAppointmentSelectionDismiss={() => setAppointmentSelection(null)}
            onAppointmentSelectionNext={(selectedFriends) => {
                if (!appointmentSelection) {
                    return;
                }

                setAppointmentProposal({
                    selection: appointmentSelection,
                    selectedFriends,
                });
            }}
        />
    );
}

export function AppointmentScheduleSelectionView() {
    return <ScheduleSelectionView title="약속 잡기" showFloatingAction={false} mode="appointment" />;
}

function isAppointmentSelectableStatus(status: EditableSlotStatus) {
    return status === 'available' || status === 'adjustable';
}

function formatAppointmentSelectionLabel(slotKeys: string[], weekDates: Date[]) {
    const slots = slotKeys
        .map((slotKey) => {
            const [dayIndex, time] = slotKey.split('-').map(Number);

            return { dayIndex, time };
        })
        .sort((first, second) => first.dayIndex - second.dayIndex || first.time - second.time);
    const firstSlot = slots[0];
    const sameDaySlots = slots.filter((slot) => slot.dayIndex === firstSlot.dayIndex);
    const startTime = Math.min(...sameDaySlots.map((slot) => slot.time));
    const endTime = Math.max(...sameDaySlots.map((slot) => slot.time)) + 0.5;
    const date = weekDates[firstSlot.dayIndex];
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

    return `${date.getDate()}일 (${weekday}) ${formatHour(startTime)} ~ ${formatHour(endTime)}`;
}

function formatHour(time: number) {
    const hour = Math.floor(time);
    const minute = time % 1 === 0 ? '00' : '30';

    return `${String(hour).padStart(2, '0')}:${minute}`;
}
