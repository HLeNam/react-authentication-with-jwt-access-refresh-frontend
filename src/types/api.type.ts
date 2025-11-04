/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiSuccessResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: string;
    path: string;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    errors?: any;
    timestamp: string;
    path: string;
}

export class ApiError extends Error {
    statusCode: number;
    message: string;
    details?: Record<string, string[]> | Record<string, string> | string;

    constructor(
        statusCode: number,
        message: string,
        details?: Record<string, string[]> | Record<string, string> | string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        this.name = "ApiError";
    }

    static fromResponse(response: ApiErrorResponse, statusCode: number): ApiError {
        console.log("🚀 ~ ApiError ~ fromResponse ~ response:", response);

        return new ApiError(
            statusCode,
            response.message || "An error occurred",
            response.errors || {}
        );
    }
}
