import { Navigate, Route, Routes } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { AppointmentFriendFirstSelectionView } from '@/view/appointment-friend-first-selection-view';
import { AppointmentGroupSelectionView } from '@/view/appointment-group-selection-view';
import { ChatListView } from '@/view/chat-list-view';
import { ChatRoomView } from '@/view/chat-room-view';
import { FriendsListView } from '@/view/friend-list-view';
import { HomeScreen } from '@/view/home-screen';
import { InviteAcceptanceView } from '@/view/invite-acceptance-view';
import { MyPageView } from '@/view/my-page-view';
import { PlaceholderView } from '@/view/placeholder-view';
import { AppointmentScheduleSelectionView, ScheduleSelectionView } from '@/view/schedule-selection-view';

export function AppRoutes() {
    return (
        <Routes>
            <Route path={routePaths.home} element={<HomeScreen />} />
            <Route path={routePaths.calendar} element={<ScheduleSelectionView />} />
            <Route path={routePaths.appointmentSchedule} element={<AppointmentScheduleSelectionView />} />
            <Route path={routePaths.appointmentFriends} element={<AppointmentFriendFirstSelectionView />} />
            <Route path={routePaths.appointmentGroups} element={<AppointmentGroupSelectionView />} />
            <Route path={routePaths.invite} element={<InviteAcceptanceView />} />
            <Route path={routePaths.friends} element={<FriendsListView />} />
            <Route path={routePaths.chat} element={<ChatListView tab="group" />} />
            <Route path={routePaths.chatDirect} element={<ChatListView tab="direct" />} />
            <Route path={routePaths.chatAppointments} element={<ChatListView tab="appointment" />} />
            <Route path={routePaths.chatUnread} element={<ChatListView tab="unread" />} />
            <Route path={routePaths.chatAll} element={<ChatListView tab="all" />} />
            <Route path={routePaths.chatRoomPattern} element={<ChatRoomView />} />
            <Route path={routePaths.mypage} element={<MyPageView />} />
            <Route path="*" element={<Navigate to={routePaths.home} replace />} />
        </Routes>
    );
}
