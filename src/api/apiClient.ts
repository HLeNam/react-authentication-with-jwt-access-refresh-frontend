import { ApiError, type ApiErrorResponse, type ApiSuccessResponse } from "@/types/api.type";
import type { TokenPair } from "@/types/auth.type";
import axios, {
    AxiosError,
    HttpStatusCode,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Event emitter để notify về logout
type AuthEventListener = () => void;

class AuthEventEmitter {
    private listeners: AuthEventListener[] = [];

    subscribe(listener: AuthEventListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    emit(): void {
        this.listeners.forEach((listener) => listener());
    }

    clear(): void {
        this.listeners = [];
    }
}

// Token Manager
class TokenManager {
    private accessToken: string | null = null;
    private readonly REFRESH_TOKEN_KEY = "refreshToken";

    getAccessToken(): string | null {
        return this.accessToken;
    }

    setAccessToken(token: string | null): void {
        this.accessToken = token;
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    setRefreshToken(token: string | null): void {
        if (token) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        }
    }

    clearTokens(): void {
        this.setAccessToken(null);
        this.setRefreshToken(null);
    }

    hasValidTokens(): boolean {
        return !!this.getAccessToken() && !!this.getRefreshToken();
    }
}

// API Client
class ApiClient {
    private axiosInstance: AxiosInstance;
    private tokenManager: TokenManager;
    private authEventEmitter: AuthEventEmitter;
    private isRefreshing: boolean = false;
    private failedQueue: Array<(token: string) => void> = [];

    constructor(
        tokenManager: TokenManager,
        authEventEmitter: AuthEventEmitter,
        baseURL: string = API_BASE_URL
    ) {
        this.tokenManager = tokenManager;
        this.authEventEmitter = authEventEmitter;

        this.axiosInstance = axios.create({
            baseURL,
            timeout: 20000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.setupRequestInterceptor();
        this.setupResponseInterceptor();
    }

    private setupRequestInterceptor(): void {
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.tokenManager.getAccessToken();
                console.log("🚀 ~ ApiClient ~ setupRequestInterceptor ~ token:", token);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );
    }

    private setupResponseInterceptor(): void {
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse<ApiSuccessResponse>) => response,
            (error: AxiosError<ApiErrorResponse>) => {
                return this.handleResponseError(error);
            }
        );
    }

    private handleResponseError(
        error: AxiosError<ApiErrorResponse>
    ): Promise<AxiosResponse | never> {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Unauthorized
        if (error.response?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
            return this.handleUnauthorized(originalRequest);
        }

        // Handle Network Error
        if (error.message === "Network Error") {
            throw new ApiError(0, "NETWORK_ERROR", "No network connection");
        }

        // Transform error response
        if (error.response?.data || error.response?.status) {
            const errorResponse = error.response.data;
            throw ApiError.fromResponse(errorResponse, error.response.status || error.status!);
        }

        // Handle timeout
        if (error.code === "ECONNABORTED") {
            throw new ApiError(408, "TIMEOUT", "The request has timed out");
        }

        // Handle no response
        if (!error.response) {
            throw new ApiError(0, "NETWORK_ERROR", "No network connection");
        }

        throw new ApiError(500, "UNKNOWN_ERROR", "An unknown error occurred");
    }

    private async handleUnauthorized(
        originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
    ): Promise<AxiosResponse> {
        if (this.isRefreshing) {
            // Nếu đang refresh, thêm request vào queue
            return new Promise((resolve, reject) => {
                this.failedQueue.push((token: string) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    // ✅ Gọi lại API với token mới
                    this.axiosInstance(originalRequest).then(resolve).catch(reject);
                });
            });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
            const newAccessToken = await this.refreshAccessToken();
            console.log("🚀 ~ ApiClient ~ handleUnauthorized ~ newAccessToken:", newAccessToken);
            this.processQueue(newAccessToken);
            // ✅ Gọi lại request gốc với token mới
            return this.axiosInstance(originalRequest);
        } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);

            this.tokenManager.clearTokens();
            this.authEventEmitter.emit();
            this.failedQueue = []; // ✅ Xóa queue khi logout

            throw new ApiError(HttpStatusCode.Unauthorized, "UNAUTHORIZED", "Session has expired");
        } finally {
            this.isRefreshing = false;
        }
    }

    private async refreshAccessToken(): Promise<string> {
        const refreshToken = this.tokenManager.getRefreshToken();

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await axios.post<
            ApiSuccessResponse<{
                tokens: TokenPair;
            }>
        >(
            `${this.axiosInstance.defaults.baseURL}/auth/refresh`,
            { refreshToken: `${refreshToken}` },
            { timeout: 20000 }
        );

        const newAccessToken = response.data.data?.tokens.accessToken;
        console.log("🚀 ~ ApiClient ~ refreshAccessToken ~ newAccessToken:", newAccessToken);
        const newRefreshToken = response.data.data?.tokens.refreshToken;
        console.log("🚀 ~ ApiClient ~ refreshAccessToken ~ newRefreshToken:", newRefreshToken);

        this.tokenManager.setAccessToken(newAccessToken!);
        if (newRefreshToken) {
            this.tokenManager.setRefreshToken(newRefreshToken);
        }

        return newAccessToken!;
    }

    private processQueue(token: string): void {
        this.failedQueue.forEach((callback) => callback(token));
        this.failedQueue = [];
    }

    // Public methods
    getInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    getTokenManager(): TokenManager {
        return this.tokenManager;
    }

    getAuthEventEmitter(): AuthEventEmitter {
        return this.authEventEmitter;
    }

    setAccessToken(token: string | null): void {
        this.tokenManager.setAccessToken(token);
    }

    setRefreshToken(token: string | null): void {
        this.tokenManager.setRefreshToken(token);
    }

    clearTokens(): void {
        this.tokenManager.clearTokens();
    }

    getAccessToken(): string | null {
        return this.tokenManager.getAccessToken();
    }

    getRefreshToken(): string | null {
        return this.tokenManager.getRefreshToken();
    }
}

// Singleton instances
const tokenManager = new TokenManager();
const authEventEmitterInstance = new AuthEventEmitter();
const apiClientInstance = new ApiClient(tokenManager, authEventEmitterInstance);

// Export individual functions for convenience
export const setAccessToken = (token: string | null) => apiClientInstance.setAccessToken(token);
export const getAccessToken = () => apiClientInstance.getAccessToken();
export const setRefreshToken = (token: string | null) => apiClientInstance.setRefreshToken(token);
export const getRefreshToken = () => apiClientInstance.getRefreshToken();
export const clearTokens = () => apiClientInstance.clearTokens();

// Exports
export { TokenManager, AuthEventEmitter, ApiClient };
export const authEventEmitter = authEventEmitterInstance;
export default apiClientInstance.getInstance();
