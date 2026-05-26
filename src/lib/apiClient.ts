import axios, {AxiosError, InternalAxiosRequestConfig} from "axios";
import * as SecureStore from "expo-secure-store";

export class ApiError extends Error {
    status: number;
    errorCode?: string;

    constructor(message: string, status: number, errorCode?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errorCode = errorCode;
    }
}

export class AuthenticationError extends ApiError {
    constructor(
        message: string = "로그인이 필요합니다.",
        status: number = 401,
        errorCode?: string
    ) {
        super(message, status, errorCode);
        this.name = "AuthenticationError";
    }
}

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const accessToken = await SecureStore.getItemAsync("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;

        const status = error.response?.status;

        if ((status === 401 || status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken();
                }

                await refreshPromise;
                refreshPromise = null;

                const newAccessToken = await SecureStore.getItemAsync("accessToken");

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;

                await SecureStore.deleteItemAsync("accessToken");
                await SecureStore.deleteItemAsync("refreshToken");

                throw new AuthenticationError("로그인이 필요합니다.", status ?? 401);
            }
        }

        const errorData = error.response?.data;
        const message =
            errorData?.data?.message ||
            errorData?.message ||
            "API 요청에 실패했습니다.";

        const errorCode =
            errorData?.data?.errorCode ||
            errorData?.errorCode;

        throw new ApiError(message, status ?? 500, errorCode);
    }
);

async function refreshAccessToken() {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!refreshToken) {
        throw new AuthenticationError();
    }

    // TODO : 추후 올바른 경로로 토큰 재발급 API 연결
    const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/re-issue`,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );

    const {accessToken, refreshToken: newRefreshToken} = response.data.data;

    await SecureStore.setItemAsync("accessToken", accessToken);

    if (newRefreshToken) {
        await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    }
}

export default api;