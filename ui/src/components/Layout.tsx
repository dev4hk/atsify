import Header from "./Header";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div className="relative flex flex-col min-h-screen text-gray-100">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(600px_400px_at_100%_20%,rgba(20,184,166,0.18),transparent),linear-gradient(180deg,#0b1220_0%,#0b1220_35%,#111827_100%)]" />
            </div>

            <Header />
            <main className="flex-grow pt-24 px-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
