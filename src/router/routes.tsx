import type { PropsWithChildren } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { getAccessToken } from '@/lib/auth-token-storage';
import { AppointmentFriendFirstSelectionView } from '@/view/appointment-friend-first-selection-view';
import { AppointmentGroupSelectionView } from '@/view/appointment-group-selection-view';
import { ChatListView } from '@/view/chat-list-view';
import { ChatRoomView } from '@/view/chat-room-view';
import { FriendsListView } from '@/view/friend-list-view';
import { HomeScreen } from '@/view/home-screen';
import { InviteAcceptanceView } from '@/view/invite-acceptance-view';
import { LoginView } from '@/view/login-view';
import { MyPageView } from '@/view/my-page-view';
import { AppointmentScheduleSelectionView, ScheduleSelectionView } from '@/view/schedule-selection-view';

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path={routePaths.login}
                element={
                    <PublicOnlyRoute>
                        <LoginView />
                    </PublicOnlyRoute>
                }
            />
            <Route
                path={routePaths.home}
                element={
                    <ProtectedRoute>
                        <HomeScreen />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.calendar}
                element={
                    <ProtectedRoute>
                        <ScheduleSelectionView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.appointmentSchedule}
                element={
                    <ProtectedRoute>
                        <AppointmentScheduleSelectionView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.appointmentFriends}
                element={
                    <ProtectedRoute>
                        <AppointmentFriendFirstSelectionView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.appointmentGroups}
                element={
                    <ProtectedRoute>
                        <AppointmentGroupSelectionView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.invite}
                element={
                    <ProtectedRoute>
                        <InviteAcceptanceView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.friends}
                element={
                    <ProtectedRoute>
                        <FriendsListView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.chat}
                element={
                    <ProtectedRoute>
                        <ChatListView tab="group" />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.chatDirect}
                element={
                    <ProtectedRoute>
                        <ChatListView tab="direct" />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.chatAppointments}
                element={
                    <ProtectedRoute>
                        <ChatListView tab="appointment" />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.chatUnread}
                element={
                    <ProtectedRoute>
                        <ChatListView tab="unread" />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.chatAll}
                element={
                    <ProtectedRoute>
                        <ChatListView tab="all" />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.chatRoomPattern}
                element={
                    <ProtectedRoute>
                        <ChatRoomView />
                    </ProtectedRoute>
                }
            />
            <Route
                path={routePaths.mypage}
                element={
                    <ProtectedRoute>
                        <MyPageView />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={routePaths.home} replace />} />
        </Routes>
    );
}

function ProtectedRoute({ children }: PropsWithChildren) {
    const location = useLocation();

    if (!getAccessToken()) {
        return <Navigate to={routePaths.login} replace state={{ from: location.pathname + location.search }} />;
    }

    return children;
}

function PublicOnlyRoute({ children }: PropsWithChildren) {
    if (getAccessToken()) {
        return <Navigate to={routePaths.home} replace />;
    }

    return children;
}
