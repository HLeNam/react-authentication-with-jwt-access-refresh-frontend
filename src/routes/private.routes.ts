import withAuthGuard from "../components/AuthGuard";
import PATH from "@/constants/path";
import MainLayout from "@/layouts/MainLayout";
import type { AppRouteObject } from "@/types/route.type";
import { createElement, lazy } from "react";

const HomePage = lazy(() => import("@/pages/Home"));

const privateRoutes: AppRouteObject[] = [
    {
        path: "/",
        Component: withAuthGuard(MainLayout),
        errorElement: createElement(lazy(() => import("@/pages/ErrorPage"))),
        children: [
            {
                path: PATH.home,
                index: true,
                Component: HomePage,
            },
        ],
    },
];

export default privateRoutes;
