import {loginWithSocialToken} from "@/api/auth/AuthApiClient";
import {loginWithKakao} from "@/features/auth/services/kakao-login";
import {saveAuthSession} from "@/features/auth/services/auth-session-storage";
import {
    SocialLoginProvider,
    SocialLoginRequest,
    SocialLoginResponse,
    SocialLoginResult,
} from "@/features/auth/types";
import {loginWithGoogle} from "@/features/auth/services/google-login";
import {getDeviceName, getOrCreateDeviceId} from "@/lib/device-util";

async function getSocialProviderCredential(
    provider: SocialLoginProvider,
): Promise<SocialLoginResult> {
    switch (provider) {
        case "KAKAO":
            return loginWithKakao();
        case "GOOGLE":
            return loginWithGoogle();
        case "APPLE":
            throw new Error(`${provider} 로그인이 아직 준비 중입니다.`);
        default:
            throw new Error("지원하지 않는 로그인 방식입니다.");
    }
}

async function createSocialLoginRequest(socialLoginResult: SocialLoginResult): Promise<SocialLoginRequest> {
    return {
        provider: socialLoginResult.provider,
        accessToken: socialLoginResult.accessToken,
        idToken: socialLoginResult.idToken,
        name: socialLoginResult.name,
        deviceId: await getOrCreateDeviceId(),
        deviceName: getDeviceName(),
    };
}

export async function loginWithSocialProvider(
    provider: SocialLoginProvider,
): Promise<SocialLoginResponse> {
    const socialLoginResult = await getSocialProviderCredential(provider);
    const authSession = await loginWithSocialToken(await createSocialLoginRequest(socialLoginResult));

    await saveAuthSession(authSession);

    return authSession;
}
