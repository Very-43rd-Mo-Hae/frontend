import { ActiveLightningBadge } from '@/components/common/friend-status/active-lightning-badge';
import { FriendStatusRing } from '@/components/common/friend-status/friend-status-ring';
import { type RingSlots } from '@/components/common/friend-status/ring-colors';
import { GenericAvatar } from '@/components/common/nav/generic-avatar';

type FriendStatusItemProps = {
  name: string;
  slots: RingSlots;
  isActive?: boolean;
  activeColor?: string;
  onClick?: () => void;
};

export function FriendStatusItem({
  name,
  slots,
  isActive = false,
  activeColor = '#66f2f6',
  onClick,
}: FriendStatusItemProps) {
  const itemContent = (
    <>
      <div className="relative">
        <FriendStatusRing slots={slots}>
          <GenericAvatar size={46} />
        </FriendStatusRing>
        {isActive && (
          <div className="absolute -right-1 -top-1">
            <ActiveLightningBadge color={activeColor} />
          </div>
        )}
      </div>
      <p className="mt-[3px] text-center font-display text-sm text-relink-ink">
        {name}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="flex h-[88px] basis-1/5 shrink-0 grow-0 cursor-pointer flex-col items-center bg-transparent p-0 text-inherit"
        onClick={onClick}
      >
        {itemContent}
      </button>
    );
  }

  return (
    <div className="flex h-[88px] basis-1/5 shrink-0 grow-0 flex-col items-center">
      {itemContent}
    </div>
  );
}
