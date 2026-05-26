import {SocialLoginRequest, SocialLoginResponse} from "@/features/auth/types";
import apiClient from "@/lib/apiClient";

export const getMyInfoWithKakaoToken = async (
    socialLoginRequest: SocialLoginRequest
): Promise<SocialLoginResponse> => {
    const response = await apiClient.post("/api/v1/auth/social/login", socialLoginRequest);

    return response.data;
}