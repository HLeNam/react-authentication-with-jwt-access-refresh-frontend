import apiClient from "@/api/apiClient";
import type { ApiSuccessResponse } from "@/types/api.type";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "@/types/auth.type";
import type { User } from "@/types/user.type";

const PATH = "/auth";

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await apiClient.post<ApiSuccessResponse<LoginResponse>>(
            `${PATH}/login`,
            data,
            { withCredentials: true }
        );
        return response.data.data;
    },

    register: async (data: RegisterRequest) => {
        const response = await apiClient.post<ApiSuccessResponse<RegisterResponse>>(
            `${PATH}/register`,
            data,
            { withCredentials: true }
        );
        return response.data.data;
    },

    logout: async () => {
        const response = await apiClient.post<ApiSuccessResponse<string>>(`${PATH}/logout`, {
            withCredentials: true,
        });
        return response.data.data;
    },

    getUserProfile: async () => {
        const response = await apiClient.get<ApiSuccessResponse<User>>(`${PATH}/profile`, {});

        return response.data.data;
    },
};
