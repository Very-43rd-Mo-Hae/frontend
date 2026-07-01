import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchMyPageProfile } from '@/api/mypage';
import { fetchNotifications } from '@/api/notifications';
import notificationSvg from '@/assets/icons/notification.svg';
import logoImage from '@/assets/images/logo.png';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';
import { GenericAvatar } from '@/components/common/nav/generic-avatar';
import { routePaths } from '@/constants/route-paths';
import type { MyPageProfile } from '@/features/mypage/types';

export function HomeHeader() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<MyPageProfile | null>(null);
    const [hasUnreadNotification, setHasUnreadNotification] = useState(false);

    useEffect(() => {
        let isMounted = true;

        fetchMyPageProfile()
            .then((nextProfile) => {
                if (isMounted) {
                    setProfile(nextProfile);
                }
            })
            .catch(() => undefined);

        fetchNotifications(0, 1)
            .then((response) => {
                if (isMounted) {
                    setHasUnreadNotification(response.hasUnread);
                }
            })
            .catch(() => undefined);

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <header className="flex h-14 flex-none items-center justify-between px-3 py-2">
            <img src={logoImage} alt="모해? logo" className="h-12 w-12 object-contain" />

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-relink-lavender-soft"
                    onClick={() => navigate(routePaths.notifications)}
                >
                    <InlineSvgIcon svg={notificationSvg} className="h-[22px] w-[22px]" />
                    {hasUnreadNotification ? (
                        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-relink-white bg-relink-rose" />
                    ) : null}
                </button>
                <button
                    type="button"
                    aria-label="My page settings"
                    className="flex h-10 w-10 items-center justify-center"
                    onClick={() => navigate(routePaths.mypage)}
                >
                    <GenericAvatar size={34} imageUrl={profile?.imageUrl} />
                </button>
            </div>
        </header>
    );
}
