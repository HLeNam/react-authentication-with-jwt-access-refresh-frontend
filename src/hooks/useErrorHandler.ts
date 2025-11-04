import { ApiError } from "@/types/api.type";
import { isEmptyObject } from "@/utils/utils";
import { useCallback, useState } from "react";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import { toast } from "sonner";

interface useErrorHandlerProps<T extends FieldValues> {
    form?: UseFormReturn<T>;
}

export const useErrorHandler = <T extends FieldValues>({
    form = undefined,
}: useErrorHandlerProps<T>) => {
    const [stateError, setStateError] = useState<ApiError | Error | null>(null);

    const handleError = useCallback(
        (err: unknown) => {
            if (err instanceof ApiError) {
                if (err.message === "NETWORK_ERROR") {
                    console.log("🚀 ~ useErrorHandler ~ err:", err);
                    toast.error(
                        "Network error occurred! This occurs when there is no connection to the server or your network has issues.",
                        {
                            position: "top-center",
                        }
                    );
                    throw new Error(
                        "Network error occurred! This occurs when there is no connection to the server or your network has issues."
                    );
                }

                if (!isEmptyObject(err.details)) {
                    const details = err.details as Record<string, string[]>;
                    if (form) {
                        Object.keys(details).forEach((field) => {
                            const messages = details[field];
                            form.setError(field as Path<T>, {
                                type: "server",
                                message: Array.isArray(messages)
                                    ? messages.join(" ")
                                    : (messages as string),
                            });
                        });
                        return;
                    }
                } else if (typeof err.details === "string") {
                    toast.error(err.details, {
                        position: "top-right",
                    });
                } else if (err.message) {
                    toast.error(err.message, {
                        position: "top-right",
                    });
                } else {
                    toast.error("An unexpected error occurred.", {
                        position: "top-right",
                    });
                }
            } else if (err instanceof Error) {
                if (err.message === "NETWORK_ERROR") {
                    throw new Error(
                        "Network error occurred! This occurs when there is no connection to the server or your network has issues."
                    );
                }

                toast.error(err.message || "An unexpected error occurred.", {
                    position: "top-right",
                });
            } else {
                toast.error("An unexpected error occurred.", {
                    position: "top-right",
                });
            }
        },
        [form]
    );

    return { stateError, setStateError, handleError };
};
