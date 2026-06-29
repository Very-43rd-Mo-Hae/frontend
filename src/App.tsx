import { useLocation } from 'react-router-dom';

import { MobileScreenLayout } from '@/components/mobile-screen-layout';
import { BottomNavigation } from '@/components/common/nav/bottom-navigation';
import { routePaths } from '@/constants/route-paths';
import { AppRoutes } from '@/router/routes';

export default function App() {
    const location = useLocation();
    const shouldShowBottomNavigation =
        location.pathname !== routePaths.login &&
        location.pathname !== routePaths.appointmentSchedule &&
        location.pathname !== routePaths.appointmentFriends &&
        location.pathname !== routePaths.appointmentGroups &&
        !location.pathname.startsWith('/chat/rooms/') &&
        !location.pathname.startsWith('/invite/');

    return (
        <MobileScreenLayout>
            <div className="relative flex h-full min-h-0 flex-col bg-relink-white">
                <AppRoutes />
                {shouldShowBottomNavigation ? <BottomNavigation /> : null}
            </div>
        </MobileScreenLayout>
    );
}
