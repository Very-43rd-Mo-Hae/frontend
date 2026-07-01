import lightningSvg from '@/assets/icons/lightning.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { HelpBadge } from '@/components/common/nav/help-badge';
import { SegmentTab } from '@/features/home/components/segment-tab';

export type FriendOverviewTab = 'friends' | 'groups';

type FriendOverviewHeaderProps = {
  activeTab: FriendOverviewTab;
  onTabChange: (tab: FriendOverviewTab) => void;
};

export function FriendOverviewHeader({ activeTab, onTabChange }: FriendOverviewHeaderProps) {
  return (
    <div className="flex h-[22px] items-center">
      <div className="flex gap-1">
        <SegmentTab
          label="친구"
          isActive={activeTab === 'friends'}
          onClick={() => onTabChange('friends')}
        />
        <SegmentTab
          label="그룹"
          isActive={activeTab === 'groups'}
          onClick={() => onTabChange('groups')}
        />
      </div>
      {activeTab === 'friends' ? (
        <div className="ml-[13px] flex items-center gap-[13px]">
          <InlineSvgIcon svg={lightningSvg} className="h-[22px] w-[15px] object-contain" />
          <div className="h-3.5 w-3.5 rounded-full bg-relink-scheduleGreen" />
        </div>
      ) : null}
      <HelpBadge />
    </div>
  );
}
