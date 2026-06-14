import {
  emptySlotColor,
  type RingSlots,
  ringColorMap,
} from '@/components/common/friend-status/ring-colors';

type ProgressRowProps = {
  slots: RingSlots;
  className?: string;
  slotClassName?: string;
};

const PROGRESS_SLOT_COUNT = 8;

export function ProgressRow({
  slots,
  className = 'flex h-[5px] w-[142px]',
  slotClassName = 'h-[5px] w-[17.75px] rounded-[2px]',
}: ProgressRowProps) {
  return (
    <div className={className}>
      {Array.from({ length: PROGRESS_SLOT_COUNT }, (_, slotIndex) => {
        const color = slots[slotIndex];

        return (
          <div
            key={slotIndex}
            className={slotClassName}
            style={{
              backgroundColor: color ? ringColorMap[color] : emptySlotColor,
            }}
          />
        );
      })}
    </div>
  );
}
