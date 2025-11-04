import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "@/routes/index.tsx";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/constants/queryClient";
import { AppProvider } from "@/contexts";
import ErrorBoundary from "@/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={true} />
            <ErrorBoundary>
                <AppProvider>
                    <RouterProvider router={router} />
                </AppProvider>
            </ErrorBoundary>
        </QueryClientProvider>
        <Toaster />
    </StrictMode>
);
