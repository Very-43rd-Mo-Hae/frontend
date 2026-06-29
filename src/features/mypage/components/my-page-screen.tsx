import { FloatingAddButton } from '@/components/common/floating-add-button';
import { FriendSummaryCard } from '@/features/mypage/components/friend-summary-card';
import { MyPageHeader } from '@/features/mypage/components/my-page-header';
import { MyPageProfileSection } from '@/features/mypage/components/my-page-profile-section';
import { SettingsCard } from '@/features/mypage/components/settings-card';
import { SettingsSectionTitle } from '@/features/mypage/components/settings-section-title';
import type { MyPageProfile } from '@/features/mypage/types';

type MyPageScreenProps = {
    profile: MyPageProfile;
};

export function MyPageScreen({ profile }: MyPageScreenProps) {
    return (
        <div className="relative flex h-full min-h-0 flex-col bg-relink-white">
            <MyPageHeader />

            <main className="relink-hidden-scrollbar min-h-0 flex-1 overflow-y-auto pb-24">
                <MyPageProfileSection profile={profile} />
                <FriendSummaryCard friendCount={profile.friendCount} />
                <SettingsSectionTitle />
                <SettingsCard profile={profile} />
            </main>

            <FloatingAddButton />
        </div>
    );
}
