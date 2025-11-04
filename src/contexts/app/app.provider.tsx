import { useEffect, useState } from "react";
import { AppContext, INITIAL_APP_STATE } from "@/contexts/app/app.context";
import { useGetUserProfile } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { authEventEmitter, getRefreshToken } from "@/api/apiClient";
import { Spinner } from "@/components/ui/spinner";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(INITIAL_APP_STATE.isAuthenticated);
    const [isInitializing, setIsInitializing] = useState(true);
    const queryClient = useQueryClient();

    const hasRefreshToken = !!getRefreshToken();
    const isCallApi = hasRefreshToken && !isInitializing;

    console.log("🚀 ~ AppProvider ~ isCallApi:", isCallApi);
    console.log("🚀 ~ AppProvider ~ hasRefreshToken:", hasRefreshToken);

    const { data, isLoading, error } = useGetUserProfile(isCallApi);

    console.log("🚀 ~ AppProvider ~ error:", error);

    useEffect(() => {
        if (isInitializing) {
            if (!hasRefreshToken) {
                setIsAuthenticated(false);
                setIsInitializing(false);
            } else if (!isLoading) {
                setIsInitializing(false);
            }
        }
    }, [isLoading, isInitializing, hasRefreshToken]);

    useEffect(() => {
        if (isLoading || isInitializing) return;

        if (data) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [data, isLoading, isInitializing]);

    useEffect(() => {
        const unsubscribe = authEventEmitter.subscribe(() => {
            console.log("🚀 ~ Token expired, logging out...");
            handleLogout();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleLogout = () => {
        queryClient.removeQueries({ queryKey: ["userProfile"] });
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <Spinner className="size-12 text-white" />
            </div>
        );
    }

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                profile: data || null,
                isLoading: isLoading || isInitializing,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
