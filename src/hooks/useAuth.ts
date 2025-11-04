import { authService } from "@/services/authService";
import type { LoginRequest, RegisterRequest } from "@/types/auth.type";
import { LocalStorageEventTarget } from "@/utils/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useLoginUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: (data) => {
            console.log("Login successful:", data);
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};

export const useRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (data) => {
            console.log("Registration successful:", data);
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};

export const useLogoutUser = () => {
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: (data) => {
            console.log("Logout successful:", data);
            LocalStorageEventTarget.dispatchEvent(new Event("userInfoCleared"));
        },
    });
};

export const useGetUserProfile = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: () => authService.getUserProfile(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled,
        throwOnError(error) {
            if (error.message === "NETWORK_ERROR") {
                throw new Error(
                    "Network error occurred! This occurs when there is no connection to the server or your network has issues."
                );
            }
            return false;
        },
    });
};
