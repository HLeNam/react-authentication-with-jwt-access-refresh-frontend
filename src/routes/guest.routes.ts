import withGuestGuard from "@/components/GuestGuard";
import PATH from "@/constants/path";
import type { AppRouteObject } from "@/types/route.type";
import { lazy } from "react";

const RegisterLayout = lazy(() => import("@/layouts/RegisterLayout"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));

const guestRoutes: AppRouteObject[] = [
    {
        path: "/",
        Component: withGuestGuard(RegisterLayout),
        children: [
            {
                path: PATH.login,
                Component: Login,
            },
            {
                path: PATH.register,
                Component: Register,
            },
        ],
    },
];

export default guestRoutes;
