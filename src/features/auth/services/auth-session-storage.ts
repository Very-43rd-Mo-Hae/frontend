import * as SecureStore from "expo-secure-store";

import type {SocialLoginResponse} from "@/features/auth/types";

export async function saveAuthSession(authSession: SocialLoginResponse) {
    await SecureStore.setItemAsync("accessToken", authSession.accessToken);
    await SecureStore.setItemAsync("memberId", authSession.memberId.toString());
}
