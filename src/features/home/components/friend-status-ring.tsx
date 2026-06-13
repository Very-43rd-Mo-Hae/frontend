import type { ReactNode } from 'react';

import { type RingSlots, ringColorMap } from '@/features/home/constants/ring-colors';

type FriendStatusRingProps = {
  slots: RingSlots;
  children?: ReactNode;
};

const SLOT_COUNT = 8;
const DEGREES_PER_SLOT = 360 / SLOT_COUNT;
const EMPTY_SLOT_COLOR = '#d9d9d9';

function createConicGradient(slots: RingSlots) {
  const segments = Array.from({ length: SLOT_COUNT }, (_, slotIndex) => {
    const color = slots[slotIndex];
    const start = slotIndex * DEGREES_PER_SLOT;
    const end = start + DEGREES_PER_SLOT;
    const segmentColor = color ? ringColorMap[color] : EMPTY_SLOT_COLOR;

    return `${segmentColor} ${start}deg ${end}deg`;
  });

  return `conic-gradient(from 0deg, ${segments.join(', ')})`;
}

export function FriendStatusRing({ slots, children }: FriendStatusRingProps) {
  return (
    <div
      className="relative h-16 w-16 shrink-0"
      role="img"
      aria-label="친구 가능 시간 상태"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: createConicGradient(slots) }}
        aria-hidden="true"
      />

      {children && (
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-relink-white">
          {children}
        </div>
      )}
    </div>
  );
}
