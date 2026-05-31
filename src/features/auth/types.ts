export type SocialLoginProvider = 'KAKAO' | 'GOOGLE' | 'APPLE';

export type SocialLoginResult = {
    provider: SocialLoginProvider;
    idToken?: string;
    accessToken?: string;
    name?: string;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
    scopes?: string[];
};

/**
 * {
 *   "provider": "GOOGLE",
 *   "idToken": "eyJraWQiOiJ...",
 *   "accessToken": "kakao-access-token",
 *   "name": "홍길동",
 *   "deviceId": "device-uuid",
 *   "deviceName": "iPhone 15"
 * }
 */

export type SocialLoginRequest = {
    provider: SocialLoginProvider;
    idToken?: string;
    accessToken?: string;
    name?: string;
    deviceId: string;
    deviceName?: string;
}

/**
 * {
 *   "memberId": 0,
 *   "accessToken": "string",
 *   "refreshToken": "string",
 *   "accessTokenExpiresIn": 0
 * }
 */

export type SocialLoginResponse = {
    memberId: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}
