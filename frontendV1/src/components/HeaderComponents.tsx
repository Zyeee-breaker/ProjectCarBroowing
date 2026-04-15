import { Link } from "react-router-dom";
import IconsCars from "@/assets/IconsCars.png";

function HeaderComponents() {
    return (
        <header
            className="
            w-full sticky top-0 z-50
            border-b border-white/20
            backdrop-blur-md
            transition-colors
            bg-[#AEDEFC] dark:bg-[#393E46]
            shadow-sm
        "
        >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white hover:scale-105 transition"
                >
                    <img
                        src={IconsCars}
                        alt="Cars Browsing"
                        className="w-10 h-10 object-contain drop-shadow-md dark:invert"
                    />
                    <span className="tracking-wide">Cars Browsing</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link
                        to="/"
                        className="text-gray-900/80 dark:text-white/80 hover:text-white dark:hover:text-white transition"
                    >
                        Home
                    </Link>

                    <Link
                        to="/cars"
                        className="text-gray-900/80 dark:text-white/80 hover:text-white dark:hover:text-white transition"
                    >
                        Cars
                    </Link>
                    <Link
                        to="/history"
                        className="text-gray-900/80 dark:text-white/80 hover:text-white dark:hover:text-white transition"
                    >
                        Bookings
                    </Link>

                    <Link
                        to="/about"
                        className="text-gray-900/80 dark:text-white/80 hover:text-white dark:hover:text-white transition"
                    >
                        About
                    </Link>
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    <Link to={"/login"}>
                        <button
                            className="
                        px-4 py-1.5 rounded-xl
                        bg-white/40 dark:bg-white/10
                        text-gray-900 dark:text-white
                        backdrop-blur-md
                        hover:scale-105 transition
                        border border-white/30
                    " >
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default HeaderComponents;