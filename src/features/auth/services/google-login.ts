import {SocialLoginResult} from "@/features/auth/types";
import Constants from "expo-constants";
import {GoogleSignin, isSuccessResponse} from "@react-native-google-signin/google-signin";

let googleSigninConfigured = false;

function ensureGoogleSigninConfigured() {
    const webClientId = Constants.expoConfig?.extra?.googleWebClientId;

    if (typeof webClientId !== 'string' || webClientId.length === 0) {
        throw new Error('Google Web Client ID가 설정되어 있지 않습니다.');
    }

    if (!googleSigninConfigured) {
        GoogleSignin.configure({
            webClientId,
            scopes: ['profile', 'email'],
        });

        googleSigninConfigured = true;
    }
}

export async function loginWithGoogle(): Promise<SocialLoginResult> {
    ensureGoogleSigninConfigured();

    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();

    if(!isSuccessResponse(response)) {
        throw new Error('Google 로그인에 실패했습니다.');
    }

    if(!response.data.idToken) {
        throw new Error('Google idToken을 가져오지 못했습니다.');
    }

    return {
        provider: 'GOOGLE',
        idToken: response.data.idToken,
        name: response.data.user.name ?? undefined
    }
}