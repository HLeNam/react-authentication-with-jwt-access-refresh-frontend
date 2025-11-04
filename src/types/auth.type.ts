import { z } from "zod";

export const authUserSchema = z.object({
    id: z.string().min(1),
    email: z.email(),
    createdAt: z.string(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export type TokenPair = {
    accessToken: string;
    refreshToken: string;
};

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;
export type LoginRequest = LoginType;
export type LoginResponse = {
    user: AuthUser;
    tokens: TokenPair;
};

export const registerSchema = z
    .object({
        email: z.email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), {
                message:
                    "Password must contain at least one lowercase letter, one uppercase letter, and one number",
            }),
        confirmPassword: z
            .string()
            .min(6, "Confirm Password must be at least 6 characters")
            .refine((val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), {
                message:
                    "Confirm password must contain at least one lowercase letter, one uppercase letter, and one number",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type RegisterType = z.infer<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterType, "confirmPassword">;
export type RegisterResponse = {
    user: AuthUser;
    tokens: TokenPair;
};
