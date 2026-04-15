import { Link } from "react-router-dom";
import CarsIcons from "@/assets/IconsCars.png";

function FooterComponent() {
    return (
        <footer className="w-full bg-[#E8F9FF] dark:bg-[#222831] border-t border-gray-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* BRAND */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <img
                            src={CarsIcons}
                            className="w-10 h-10 object-contain dark:invert"
                        />
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Cars Broowing
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Platform peminjaman mobil yang cepat, mudah, dan terpercaya untuk kebutuhan perjalananmu.
                    </p>
                </div>

                {/* NAVIGATION */}
                <div className="flex flex-col gap-2">
                    <h2 className="font-semibold text-gray-800 dark:text-white">
                        Navigasi
                    </h2>

                    <Link
                        to="/"
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#404258] transition"
                    >
                        Home
                    </Link>

                    <Link
                        to="/aboutme"
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#404258] transition"
                    >
                        About Me
                    </Link>

                    <Link
                        to="/login"
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#404258] transition"
                    >
                        Login
                    </Link>
                </div>

                {/* CONTACT */}
                <div className="flex flex-col gap-2">
                    <h2 className="font-semibold text-gray-800 dark:text-white">
                        Kontak
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        📧 zyeeee33@gmail.com
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        📍 Indonesia
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        📞 +62 812-xxxx-xxxx
                    </p>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-white/10 py-4">
                © {new Date().getFullYear()} Cars Broowing. All rights reserved.
            </div>
        </footer>
    );
}

export default FooterComponent;