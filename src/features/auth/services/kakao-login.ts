import {initializeKakaoSDK} from '@react-native-kakao/core';
import {login} from '@react-native-kakao/user';

import {kakaoNativeAppKey} from '@/constants/kakao';
import {SocialLoginRequest, SocialLoginResponse, SocialLoginResult} from '@/features/auth/types';
import {getMyInfoWithKakaoToken} from "@/api/auth/AuthApiClient";

let kakaoSdkInitialization: Promise<void> | null = null;

function ensureKakaoSdkInitialized() {
    if (!kakaoNativeAppKey) {
        throw new Error('Kakao Native App Key가 런타임 설정에 주입되지 않았습니다.');
    }

    kakaoSdkInitialization ??= initializeKakaoSDK(kakaoNativeAppKey);

    return kakaoSdkInitialization;
}

export async function loginWithKakao(): Promise<SocialLoginResult> {
    await ensureKakaoSdkInitialized();

    const token = await login();

    return {
        provider: 'KAKAO',
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scopes: token.scopes,
    };
}

export async function getTokenByKakao(socialLoginRequest: SocialLoginRequest): Promise<SocialLoginResponse> {
    return await getMyInfoWithKakaoToken(socialLoginRequest);
}
