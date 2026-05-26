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

export type SocialLoginRequest = {
    provider: SocialLoginProvider;
    idToken?: string;
    accessToken?: string;
    name?: string;
}

export type SocialLoginResponse = {
    memberId: number;
    accessToken: string;
    accessTokenExpiresIn: number;
}
