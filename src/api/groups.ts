import apiClient from '@/lib/api-client';

export type GroupOverview = {
    groupId: number;
    name: string;
    memberCount: number;
};

type GroupListResponse = {
    groups: GroupOverview[];
};

export async function fetchMyGroups(limit = 10) {
    const response = await apiClient.get<GroupListResponse>('/groups', {
        params: { limit },
    });

    return response.groups;
}
