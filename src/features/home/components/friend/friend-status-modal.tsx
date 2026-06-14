import {
  ProgressRow,
  type RingSlots,
} from '@/components/common/friend-status';
import { FriendActionMenu } from '@/features/home/components/friend/friend-action-menu';

type FriendStatusModalProps = {
  slots: RingSlots;
  onClose: () => void;
};

export function FriendStatusModal({ slots, onClose }: FriendStatusModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="flex w-full max-w-[393px] flex-col items-start gap-4">
        <div
          className="w-full rounded-md bg-relink-white px-[22px] pb-[13px] pt-[18px] shadow-relink-card"
          role="dialog"
          aria-modal="true"
          aria-label="다가오는 4H 상태"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-xl text-relink-ink">
              다가오는 4H 상태
            </h2>
            <div
              className="mt-px h-[30px] w-[102px] rounded-full border-4 border-relink-lavender-intense"
              aria-hidden="true"
            />
          </div>

          <ProgressRow
            slots={slots}
            className="mt-[22px] flex h-3 w-full"
            slotClassName="h-3 flex-1 rounded-[3px]"
          />

          <div className="mt-1.5 flex justify-between font-display text-md text-relink-ink">
            <span>20:30~</span>
            <span>~00:30</span>
          </div>
        </div>

        <FriendActionMenu />
      </div>
    </div>
  );
}
