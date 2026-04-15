import { Outlet } from "react-router-dom";
import Header from "@/components/HeaderComponents"; // kalau kamu pisah header
import FooterComponent from "../FooterComponent";

function FirstLayouts() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                <Outlet />
            </main>
            <FooterComponent />
        </>
    );
}

export default FirstLayouts;