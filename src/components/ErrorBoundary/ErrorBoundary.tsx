import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error details
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                    <div className="w-full max-w-2xl">
                        {/* Main Error Card */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            {/* Header */}
                            <div className="border-b border-gray-200 px-8 py-6">
                                <div className="flex items-center space-x-4">
                                    {/* Error Icon */}
                                    <div className="rounded-lg bg-gray-100 p-3">
                                        <svg
                                            className="h-8 w-8 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <div className="mb-1 flex items-center space-x-3">
                                            <span className="text-4xl font-bold text-gray-900">
                                                Error
                                            </span>
                                            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                                Application Error
                                            </span>
                                        </div>
                                        <h1 className="text-xl font-semibold text-gray-900">
                                            Something Went Wrong
                                        </h1>
                                        <p className="text-sm text-gray-600">
                                            An unexpected error occurred in the application
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-8 py-6">
                                {/* Error Message */}
                                <div className="mb-6">
                                    <h2 className="mb-2 flex items-center text-sm font-medium text-gray-700">
                                        <svg
                                            className="mr-2 h-4 w-4 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Error Details:
                                    </h2>
                                    <div className="rounded border border-gray-200 bg-gray-50 p-4">
                                        <p className="font-mono text-sm text-gray-700">
                                            {this.state.error?.toString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Component Stack (in development) */}
                                {this.state.errorInfo && (
                                    <div className="mb-6">
                                        <h2 className="mb-2 text-sm font-medium text-gray-700">
                                            Component Stack:
                                        </h2>
                                        <div className="max-h-48 overflow-auto rounded border border-gray-200 bg-gray-50 p-4">
                                            <pre className="font-mono text-xs text-gray-700">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        onClick={this.handleReset}
                                        className="flex items-center justify-center space-x-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        <span>Try Again</span>
                                    </button>

                                    <button
                                        onClick={() => (window.location.href = "/")}
                                        className="flex items-center justify-center space-x-2 rounded border border-gray-300 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                            />
                                        </svg>
                                        <span>Go Home</span>
                                    </button>
                                </div>

                                {/* Help Section */}
                                <div className="rounded border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 rounded bg-gray-200 p-1.5">
                                            <svg
                                                className="h-4 w-4 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-sm font-medium text-gray-900">
                                                Need Help?
                                            </h3>
                                            <ul className="space-y-1 text-sm text-gray-600">
                                                <li className="flex items-center space-x-2">
                                                    <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                                                    <span>Try refreshing the page</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                                                    <span>Clear your browser cache</span>
                                                </li>
                                                <li className="flex items-center space-x-2">
                                                    <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                                                    <span>
                                                        Contact support if the error persists
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                                Error Code:{" "}
                                <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-700">
                                    {Date.now().toString(36).toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
