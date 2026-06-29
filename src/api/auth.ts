import apiClient from '@/lib/api-client';
import { saveAuthTokens } from '@/lib/auth-token-storage';

type SocialProvider = 'GOOGLE' | 'KAKAO';

type SocialLoginRequest = {
    provider: SocialProvider;
    idToken?: string;
    accessToken?: string;
    name?: string;
    deviceId?: string;
    deviceName?: string;
};

type SocialLoginResponse = {
    memberId: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
};

const DEVICE_ID_KEY = 'relink.deviceId';

export async function loginWithGoogleIdToken(idToken: string) {
    return login({
        provider: 'GOOGLE',
        idToken,
    });
}

export async function loginWithKakaoAccessToken(accessToken: string) {
    return login({
        provider: 'KAKAO',
        accessToken,
    });
}

async function login(request: Omit<SocialLoginRequest, 'deviceId' | 'deviceName'>) {
    const response = await apiClient.post<SocialLoginResponse, SocialLoginRequest>('/auth/login', {
        ...request,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
    });

    saveAuthTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
    });

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
