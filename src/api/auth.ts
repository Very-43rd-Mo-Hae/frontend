import apiClient from '@/lib/api-client';
import { clearAuthTokens, getRefreshToken, saveAuthTokens } from '@/lib/auth-token-storage';

type SocialProvider = 'GOOGLE' | 'KAKAO';

type SocialLoginRequest = {
    provider: SocialProvider;
    idToken?: string;
    accessToken?: string;
    name?: string;
    deviceId?: string;
    deviceName?: string;
    restoreAccount?: boolean;
};

export type SocialLoginResponse = {
    memberId: number;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresIn?: number;
    requiresAccountRestore?: boolean;
};

const DEVICE_ID_KEY = 'relink.deviceId';

export async function loginWithGoogleIdToken(idToken: string, options?: { restoreAccount?: boolean }) {
    return login({
        provider: 'GOOGLE',
        idToken,
        restoreAccount: options?.restoreAccount,
    });
}

export async function loginWithKakaoAccessToken(accessToken: string, options?: { restoreAccount?: boolean }) {
    return login({
        provider: 'KAKAO',
        accessToken,
        restoreAccount: options?.restoreAccount,
    });
}

export async function logout() {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
        await apiClient.post<void, { refreshToken: string }>('/auth/logout', { refreshToken });
    }

    clearAuthTokens();
}

async function login(request: Omit<SocialLoginRequest, 'deviceId' | 'deviceName'>) {
    const response = await apiClient.post<SocialLoginResponse, SocialLoginRequest>('/auth/login', {
        ...request,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
    });

    if (!response.requiresAccountRestore && response.accessToken && response.refreshToken) {
        saveAuthTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });
    }

    return response;
}

function getDeviceId() {
    const storedDeviceId = window.localStorage.getItem(DEVICE_ID_KEY);

    if (storedDeviceId) {
        return storedDeviceId;
    }

    const deviceId = window.crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_KEY, deviceId);

    return deviceId;
}

function getDeviceName() {
    return navigator.userAgent;
}
