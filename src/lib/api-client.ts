import axios, {
    type AxiosError,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios';

import {
    clearAuthTokens,
    getAccessToken,
    getRefreshToken,
    saveAuthTokens,
} from './auth-token-storage';

type ApiEnvelope<T> = {
    data: T;
    message?: string;
    errorCode?: string;
};

type ApiResponse<T> = ApiEnvelope<T> | T;

type ApiErrorPayload = {
    data?: {
        message?: string;
        errorCode?: string;
        name?: string;
    };
    message?: string;
    errorCode?: string;
    name?: string;
};

type TokenRefreshResponse = {
    accessToken: string;
    refreshToken: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export class ApiError extends Error {
    status: number;
    errorCode?: string;

    constructor(message: string, status: number, errorCode?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errorCode = errorCode;
    }
}

export class AuthenticationError extends ApiError {
    constructor(message = '로그인이 필요합니다.', status = 401, errorCode?: string) {
        super(message, status, errorCode);
        this.name = 'AuthenticationError';
    }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const clientConfig = {
    baseURL: apiBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

const api = axios.create(clientConfig);
const publicApi = axios.create(clientConfig);

function isApiEnvelope<T>(data: ApiResponse<T>): data is ApiEnvelope<T> {
    return typeof data === 'object' && data !== null && 'data' in data;
}

function unwrapData<T>(response: AxiosResponse<ApiResponse<T>>) {
    if (isApiEnvelope(response.data)) {
        return response.data.data;
    }

    return response.data;
}

function unwrapRefreshResponse(response: AxiosResponse<ApiResponse<TokenRefreshResponse>>) {
    return unwrapData(response);
}

function buildApiError(error: AxiosError<ApiErrorPayload>) {
    const status = error.response?.status ?? 500;
    const errorData = error.response?.data;
    const message = errorData?.data?.message ?? errorData?.message ?? 'API 요청에 실패했습니다.';
    const errorCode =
        errorData?.data?.errorCode ??
        errorData?.errorCode ??
        errorData?.data?.name ??
        errorData?.name;

    return new ApiError(message, status, errorCode);
}

let refreshPromise: Promise<void> | null = null;

api.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorPayload>) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined;
        const status = error.response?.status;

        if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                refreshPromise ??= refreshAccessToken();
                await refreshPromise;
                refreshPromise = null;

                const newAccessToken = getAccessToken();

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return api(originalRequest);
            } catch {
                refreshPromise = null;
                clearAuthTokens();

                throw new AuthenticationError('로그인이 필요합니다.', status ?? 401);
            }
        }

        throw buildApiError(error);
    },
);

async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new AuthenticationError();
    }

    const response = await publicApi.post<ApiResponse<TokenRefreshResponse>>(
        '/auth/reissue',
        { refreshToken },
    );

    const tokens = unwrapRefreshResponse(response);
    saveAuthTokens(tokens);
}

const apiClient = {
    get: async <T>(url: string, config?: AxiosRequestConfig) => {
        const response = await api.get<ApiResponse<T>>(url, config);

        return unwrapData(response);
    },
    post: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => {
        const response = await api.post<ApiResponse<T>>(url, data, config);

        return unwrapData(response);
    },
    put: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => {
        const response = await api.put<ApiResponse<T>>(url, data, config);

        return unwrapData(response);
    },
    patch: async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => {
        const response = await api.patch<ApiResponse<T>>(url, data, config);

        return unwrapData(response);
    },
    delete: async <T>(url: string, config?: AxiosRequestConfig) => {
        const response = await api.delete<ApiResponse<T>>(url, config);

        return unwrapData(response);
    },
};

export { api };
export default apiClient;
