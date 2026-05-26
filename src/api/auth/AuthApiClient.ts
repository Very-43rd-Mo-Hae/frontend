import {SocialLoginRequest, SocialLoginResponse} from "@/features/auth/types";
import apiClient, {ApiError} from "@/lib/api-client";

export class AuthApiError extends Error {
    status: number;
    errorCode?: string;

    constructor(message: string, status: number, errorCode?: string) {
        super(message);
        this.name = "AuthApiError";
        this.status = status;
        this.errorCode = errorCode;
    }
}

function handleAuthApiError(error: unknown): never {
    if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
        throw new AuthApiError(error.message, error.status, error.errorCode);
    }

    throw error;
}

export const loginWithSocialToken = async (
    socialLoginRequest: SocialLoginRequest
): Promise<SocialLoginResponse> => {
    try {
        return await apiClient.post<SocialLoginResponse, SocialLoginRequest>(
            "/api/v1/auth/social/login",
            socialLoginRequest
        );
    } catch (error) {
        handleAuthApiError(error);
    }
}
