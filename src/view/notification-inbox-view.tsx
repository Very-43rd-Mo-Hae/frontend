import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    deleteNotification,
    fetchNotifications,
    markAllNotificationsRead,
} from '@/api/notifications';
import { routePaths } from '@/constants/route-paths';
import { NotificationInboxScreen } from '@/features/notifications/components/notification-inbox-screen';
import type { NotificationItem } from '@/features/notifications/types';

const pageSize = 20;

export function NotificationInboxView() {
    const navigate = useNavigate();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [hasNext, setHasNext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const groupedNotifications = useMemo(
        () => groupChatRoomNotifications(notifications),
        [notifications],
    );

    useEffect(() => {
        let ignore = false;

        setIsLoading(true);
        fetchNotifications(0, pageSize)
            .then((response) => {
                if (!ignore) {
                    setNotifications(response.notifications);
                    setPage(response.page);
                    setHasNext(response.hasNext);
                }
            })
            .catch(() => {
                if (!ignore) {
                    setNotifications([]);
                    setHasNext(false);
                }
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) {
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            if (!entries[0]?.isIntersecting || !hasNext || isLoading) {
                return;
            }

            setIsLoading(true);
            fetchNotifications(page + 1, pageSize)
                .then((response) => {
                    setNotifications((current) => [...current, ...response.notifications]);
                    setPage(response.page);
                    setHasNext(response.hasNext);
                })
                .finally(() => setIsLoading(false));
        });

        observer.observe(target);

        return () => observer.disconnect();
    }, [hasNext, isLoading, page]);

    function handleMarkAllRead() {
        const readAt = new Date().toISOString();
        void markAllNotificationsRead();
        setNotifications((current) => current.map((notification) => ({
            ...notification,
            read: true,
            readAt: notification.readAt ?? readAt,
        })));
    }

    function handleDelete(notification: NotificationItem) {
        const idsToDelete = new Set(notification.mergedIds ?? [notification.id]);
        idsToDelete.forEach((id) => deleteNotification(id));
        setNotifications((current) => current.filter((item) => !idsToDelete.has(item.id)));
    }

    function handleOpen(notification: NotificationItem) {
        if (!notification.linkUrl) {
            return;
        }

        if (notification.linkUrl.startsWith('/')) {
            navigate(notification.linkUrl);
            return;
        }

        window.location.href = notification.linkUrl;
    }

    return (
        <NotificationInboxScreen
            notifications={groupedNotifications}
            isLoading={isLoading}
            loadMoreRef={loadMoreRef}
            onBack={() => navigate(routePaths.home)}
            onMarkAllRead={handleMarkAllRead}
            onOpen={handleOpen}
            onDelete={handleDelete}
        />
    );
}

function groupChatRoomNotifications(notifications: NotificationItem[]) {
    const grouped = new Map<string, NotificationItem[]>();
    const result: NotificationItem[] = [];

    notifications.forEach((notification) => {
        const groupKey = getChatRoomGroupKey(notification);

        if (!groupKey) {
            result.push(notification);
            return;
        }

        grouped.set(groupKey, [...(grouped.get(groupKey) ?? []), notification]);
    });

    grouped.forEach((items) => {
        const latest = items[0];
        const unreadCount = items.filter((item) => !item.read).length;

        result.push({
            ...latest,
            id: `chat-group-${latest.linkUrl}`,
            body: items.length > 1
                ? `이 채팅방에 새 메시지 ${items.length}개가 도착했어요.`
                : latest.body,
            read: unreadCount === 0,
            aggregateCount: items.length,
            mergedIds: items.map((item) => item.id),
        });
    });

    return result.sort((left, right) => (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    ));
}

function getChatRoomGroupKey(notification: NotificationItem) {
    if (!notification.linkUrl?.startsWith('/chat/rooms/')) {
        return null;
    }

    return notification.linkUrl;
}
