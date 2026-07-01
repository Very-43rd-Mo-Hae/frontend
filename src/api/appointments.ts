import apiClient from '@/lib/api-client';

import type { AppointmentFriend } from '@/features/schedule/components/appointment-friend-types';

type ApiSlotStatus = 'UNAVAILABLE' | 'NEGOTIABLE' | 'AVAILABLE' | 'APPOINTMENT';

export type AppointmentCalendar = {
    weekStartDate: string;
    weekEndDate: string;
    days: {
        date: string;
        slots: {
            startTime: string;
            endTime: string;
            status: ApiSlotStatus;
            appointmentId: number | null;
        }[];
    }[];
};

type AvailableFriendListResponse = {
    startAt: string;
    endAt: string;
    friends: {
        memberId: number;
        name: string;
        imageUrl: string | null;
        calendar: AppointmentCalendar;
    }[];
};

type FriendCalendarListResponse = {
    friends: {
        memberId: number;
        name: string;
        imageUrl: string | null;
        calendar: AppointmentCalendar;
    }[];
};

type AppointmentResponse = {
    appointmentId: number;
    title: string;
    startAt: string;
    endAt: string;
    memo: string | null;
    participants: {
        memberId: number;
        name: string;
        imageUrl: string | null;
    }[];
};

export type UpcomingAppointment = AppointmentResponse;

type UpcomingAppointmentListResponse = {
    appointments: UpcomingAppointment[];
};

type CreateAppointmentRequest = {
    title: string;
    startAt: string;
    endAt: string;
    memo?: string;
    participantMemberIds: number[];
};

export async function fetchAvailableAppointmentFriends(startAt: string, endAt: string) {
    const response = await apiClient.get<AvailableFriendListResponse>('/appointments/available-friends', {
        params: { startAt, endAt },
    });

    return response.friends.map<AppointmentFriend>((friend) => ({
        memberId: friend.memberId,
        name: friend.name,
        imageUrl: friend.imageUrl,
        calendar: friend.calendar,
        availability: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'empty'],
    }));
}

export async function fetchUpcomingAppointments(limit = 5) {
    const response = await apiClient.get<UpcomingAppointmentListResponse>('/appointments/upcoming', {
        params: { limit },
    });

    return response.appointments;
}

export async function createAppointment(request: CreateAppointmentRequest) {
    return apiClient.post<AppointmentResponse, CreateAppointmentRequest>('/appointments', request);
}

export async function fetchAppointmentFriendCalendars(memberIds: number[], date: Date) {
    if (memberIds.length === 0) {
        return [];
    }

    const response = await apiClient.get<FriendCalendarListResponse>('/appointments/friend-calendars', {
        params: {
            memberIds: memberIds.join(','),
            date: formatDate(date),
        },
    });

    return response.friends.map<AppointmentFriend>((friend) => ({
        memberId: friend.memberId,
        name: friend.name,
        imageUrl: friend.imageUrl,
        calendar: friend.calendar,
        availability: ['available', 'available', 'available', 'available', 'available', 'available', 'available', 'empty'],
    }));
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
