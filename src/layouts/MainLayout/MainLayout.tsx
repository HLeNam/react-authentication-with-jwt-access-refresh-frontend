import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router";

interface MainLayoutProps {
    children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div>
            <Header />
            {children}
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;
