import { clearTokens } from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts";
import { useLogoutUser } from "@/hooks/useAuth";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useEffect } from "react";

const Home = () => {
    const { profile, setIsAuthenticated } = useAppContext();
    const { email, createdAt } = profile!;

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const logoutUserMutation = useLogoutUser();
    const { handleError } = useErrorHandler({});

    useEffect(() => {
        if (logoutUserMutation.isError) {
            handleError(logoutUserMutation.error);
        }
    }, [logoutUserMutation.isError, logoutUserMutation.error, handleError]);

    const handleLogout = async () => {
        try {
            await logoutUserMutation.mutateAsync();
            clearTokens();
            setIsAuthenticated(false);
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Welcome Back!
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            You're logged in as{" "}
                            <span className="font-semibold text-gray-900">{email}</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Account Info Section */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Your Account
                        </h2>
                        <p className="text-lg text-gray-600">
                            Overview of your account information
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Email Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Email Address
                            </h3>
                            <p className="text-gray-600 break-all">{email}</p>
                        </div>

                        {/* Created Date Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Member Since
                            </h3>
                            <p className="text-gray-600">{formatDate(createdAt)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-16 bg-white border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Quick Actions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Manage your account with these shortcuts
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-center max-w-2xl mx-auto">
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg
                                        className="w-6 h-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Sign Out
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Securely log out of your account
                                </p>
                            </div>
                            <Button variant="outline" className="w-full" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Thank You for Being With Us
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            We're constantly working to improve your experience. If you have any
                            questions or feedback, feel free to reach out!
                        </p>
                        <Button size="lg" variant="secondary" className="px-8">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
