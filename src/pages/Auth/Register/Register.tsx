import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { LeftSideContent } from "@/pages/Auth/components";
import { toast } from "sonner";
import { registerSchema, type RegisterRequest, type RegisterType } from "@/types/auth.type";
import { useRegisterUser } from "@/hooks/useAuth";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { setAccessToken, setRefreshToken } from "@/api/apiClient";
import { useAppContext } from "@/contexts";

const Register = () => {
    const navigate = useNavigate();

    const { setIsAuthenticated } = useAppContext();

    const form = useForm<RegisterType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const registerUserMutation = useRegisterUser();
    const isLoading = registerUserMutation.isPending;
    const { handleError } = useErrorHandler<RegisterType>({ form });

    const onSubmit = async (data: RegisterType) => {
        try {
            const persian: RegisterRequest = {
                email: data.email,
                password: data.password,
            };

            const res = await registerUserMutation.mutateAsync(persian);

            console.log("🚀 ~ onSubmit ~ res:", res);

            const accessToken = res?.tokens.accessToken;
            const refreshToken = res?.tokens.refreshToken;

            setAccessToken(accessToken!);
            setRefreshToken(refreshToken!);

            setIsAuthenticated(true);

            toast.success("Registration successful!", {
                position: "top-right",
            });

            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (error) {
            console.error("Registration error:", error);
            handleError(error);
        }
    };

    return (
        <div className="min-h-screen w-full text-white grid grid-cols-1 lg:grid-cols-2 overflow-x-hidden">
            {/* Left side - Content */}
            <LeftSideContent />
            {/* Right side - Register Form */}
            <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8">
                <Card className="w-full max-w-md lg:max-w-full bg-[#1E1E1E] border-gray-800 shadow-[0_4px_40px_0_rgba(255,255,255,0.05)]">
                    <CardHeader className="pb-6 sm:pb-8 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-white">
                            Create Account
                        </h2>
                    </CardHeader>

                    <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !e.shiftKey &&
                                        !isLoading &&
                                        !form.formState.isSubmitting &&
                                        form.formState.isValid
                                    ) {
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)();
                                    }
                                }}
                                className="space-y-3 sm:space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputWithIcon
                                                    placeholder="Email address"
                                                    autoComplete="email"
                                                    icon={
                                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    }
                                                    inputBg="#282828"
                                                    iconPosition="left"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputWithIcon
                                                    type="password"
                                                    placeholder="Password"
                                                    autoComplete="new-password"
                                                    icon={
                                                        <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    }
                                                    inputBg="#282828"
                                                    iconPosition="left"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <InputWithIcon
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    autoComplete="new-password"
                                                    icon={
                                                        <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    }
                                                    inputBg="#282828"
                                                    iconPosition="left"
                                                    {...field}
                                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-12 text-sm sm:text-base"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting || isLoading}
                                    className="w-full h-10 sm:h-12 bg-[#D9D9D9] text-black hover:bg-gray-200 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle
                                                className="animate-spin h-5 w-5 text-gray-800 mr-2"
                                                size={20}
                                                aria-label="Loading"
                                            />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <LogIn
                                                strokeWidth={2.5}
                                                className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                                            />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-2 text-gray-400 bg-[#1E1E1E] font-medium">
                                    or
                                </span>
                            </div>
                        </div>

                        <div className="text-center text-xs sm:text-sm">
                            <span className="text-[#786E6E]">Already have an account? </span>
                            <Link
                                to="/login"
                                className={`text-white hover:underline font-medium ${
                                    form.formState.isSubmitting || isLoading
                                        ? "pointer-events-none opacity-60"
                                        : ""
                                }`}
                                tabIndex={form.formState.isSubmitting || isLoading ? -1 : 0}
                                aria-disabled={form.formState.isSubmitting || isLoading}
                            >
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
