import { Outlet } from "react-router";

interface RegisterLayoutProps {
    children?: React.ReactNode;
}

const RegisterLayout = ({ children }: RegisterLayoutProps) => {
    return (
        <main className="mx-auto !bg-[#0A0A0A] flex flex-col min-h-screen">
            {children}
            <Outlet />
        </main>
    );
};

export default RegisterLayout;
