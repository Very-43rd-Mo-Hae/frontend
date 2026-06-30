import type { PointerEvent } from 'react';
import { useMemo, useRef } from 'react';

import { toCalendarPreviewBlocks } from '@/features/schedule/components/appointment-calendar-utils';
import { OverlapCalendarGrid } from '@/features/schedule/components/overlap-calendar-grid';
import { SelectedFriendsPreviewCard } from '@/features/schedule/components/selected-friends-preview-card';
import {
    getTimeSlotKey,
    isSelectablePreviewSlot,
    type TimeSlot,
} from '@/features/schedule/components/appointment-friend-first-utils';
import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type AppointmentOverlapTimeSelectionViewProps = {
    selectedFriends: AppointmentFriend[];
    selectedTimeSlots: TimeSlot[];
    onSelectedTimeSlotsChange: (slots: TimeSlot[]) => void;
    onBack: () => void;
    onConfirm: () => void;
};

export function AppointmentOverlapTimeSelectionView({
    selectedFriends,
    selectedTimeSlots,
    onSelectedTimeSlotsChange,
    onBack,
    onConfirm,
}: AppointmentOverlapTimeSelectionViewProps) {
    const dragSelectionRef = useRef<TimeSlot[]>([]);
    const selectedSlotKeys = useMemo(
        () => new Set(selectedTimeSlots.map((slot) => getTimeSlotKey(slot.dayIndex, slot.time))),
        [selectedTimeSlots],
    );
    const previewBlocks = useMemo(() => toCalendarPreviewBlocks(selectedFriends), [selectedFriends]);

    const startDrag = (slot: TimeSlot, event: PointerEvent<HTMLButtonElement>) => {
        if (event.button !== 0 || !isSelectablePreviewSlot(slot, previewBlocks)) {
            return;
        }

        dragSelectionRef.current = [slot];
        onSelectedTimeSlotsChange([slot]);
    };

    const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
        if (event.buttons !== 1 || dragSelectionRef.current.length === 0) {
            return;
        }

        const target = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest<HTMLButtonElement>('[data-day-index][data-time]');

        if (!target) {
            return;
        }

        const slot = {
            dayIndex: Number(target.dataset.dayIndex),
            time: Number(target.dataset.time),
        };

        if (!isSelectablePreviewSlot(slot, previewBlocks)) {
            return;
        }

        const slotKey = getTimeSlotKey(slot.dayIndex, slot.time);
        const alreadySelected = dragSelectionRef.current.some(
            (currentSlot) => getTimeSlotKey(currentSlot.dayIndex, currentSlot.time) === slotKey,
        );

        if (alreadySelected) {
            return;
        }

        dragSelectionRef.current = [...dragSelectionRef.current, slot];
        onSelectedTimeSlotsChange(dragSelectionRef.current);
    };

    const endDrag = () => {
        dragSelectionRef.current = [];
    };

    return (
        <main
            className="relink-hidden-scrollbar flex h-full min-h-0 flex-col overflow-y-auto bg-relink-white px-5 pb-4 pt-6 font-display"
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
        >
            <h1 className="text-[25px] leading-8 text-relink-gray-700">겹치는 시간을 확인해주세요</h1>

            <SelectedFriendsPreviewCard selectedFriends={selectedFriends} onBack={onBack} />

            <section className="mt-5">
                <h2 className="text-lg text-relink-gray-700">약속을 잡고 싶은 시간을 드래그해주세요</h2>
                <p className="mt-1.5 text-sm text-relink-gray-400">*나의 일정에서 가능/조율로 표시한 시간대만 선택 가능해요.</p>
                <div className="mt-3 flex items-center justify-center gap-4 text-sm text-relink-gray-700">
                    <span>모두 불가</span>
                    <div className="h-6 w-[118px] rounded-md border-[3px] border-relink-scheduleGreen bg-gradient-to-r from-relink-scheduleGreen/20 to-relink-scheduleGreen" />
                    <span>모두 가능</span>
                </div>
            </section>

            <section className="mt-4 rounded bg-relink-white px-3 pb-3 pt-3 shadow-relink-card">
                <OverlapCalendarGrid
                    blocks={previewBlocks}
                    selectedSlotKeys={selectedSlotKeys}
                    onSlotPointerDown={startDrag}
                    onSlotPointerMove={moveDrag}
                />
                <p className="mt-3 px-2 text-sm text-relink-gray-400">*나의 일정에서 가능/조율로 표시한 시간대만 표시돼요.</p>
            </section>

            <div className="mt-3 flex items-center justify-center gap-5 text-relink-lavender-intense">
                <button type="button" className="text-[20px] leading-none" aria-label="이전 주">
                    ◀
                </button>
                <p className="text-md">2026년 06월 04일 ~ 10일</p>
                <button type="button" className="text-[20px] leading-none" aria-label="다음 주">
                    ▶
                </button>
            </div>

            {selectedTimeSlots.length > 0 ? (
                <button
                    type="button"
                    className="mx-auto mt-4 h-[54px] w-full max-w-[320px] rounded-md bg-relink-lavender-intense text-lg text-relink-white"
                    onClick={onConfirm}
                >
                    확인
                </button>
            ) : null}
        </main>
    );
}
