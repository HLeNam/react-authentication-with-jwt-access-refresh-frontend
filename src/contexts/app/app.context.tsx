import type { User } from "@/types/user.type";
import { createContext, useContext } from "react";

interface AppContextInterface {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    profile: User | null;
    isLoading: boolean;
}

export const INITIAL_APP_STATE: AppContextInterface = {
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    profile: null,
    isLoading: false,
};

export const AppContext = createContext<AppContextInterface>(INITIAL_APP_STATE);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
