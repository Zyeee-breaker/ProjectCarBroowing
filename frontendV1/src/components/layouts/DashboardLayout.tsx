import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import IconsCars from "@/assets/IconsCars.png";

function DashboardLayout() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser.role) {
            navigate("/login");
            return;
        }
        setUser(storedUser);
        if (location.pathname === "/dashboard") {
            navigate(`/dashboard/${storedUser.role}`);
        }
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        Swal.fire({
            title: "Yakin logout?",
            text: "Kamu akan keluar dari akun ini",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Logout",
            cancelButtonText: "Batal",
            background: "#fff",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user");
                setUser(null);

                Swal.fire({
                    title: "Logout berhasil!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate("/login");
            }
        });
    };

    if (!user) return null;

    return (
        <section className="w-full h-auto bg-white text-gray-900 dark:bg-[#222831] flex items-center gap-2">
            <aside
                className="
                    w-64 p-3 
                    min-h-screen
                    rounded-2xl
                    bg-[#E8F9FF] dark:bg-[#393E46]
                    backdrop-blur-xl
                    border border-white/30 dark:border-white/10
                    shadow-gray-500/60
                    dark:shadow-gray-500/60
                    transition-all duration-300
                ">
                <div className="flex flex-col justify-between h-screen">
                    <div className="flex flex-col items-start">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 mb-4 group"
                        >
                            <img
                                src={IconsCars}
                                className="w-12 h-12 object-contain dark:invert transition group-hover:scale-105"
                            />
                            <h1 className="text-lg font-serif text-gray-800 dark:text-white">
                                Cars Broowing
                            </h1>
                        </Link>
                        <nav className="flex flex-col gap-1 text-sm w-full">
                            {user.role === "admin" && (
                                <>
                                    <NavLink
                                        to="/dashboard/admin"
                                        end
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? "bg-[#404258] text-white shadow-sm"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#6B728E]/60"
                                            }`
                                        }
                                    >
                                        Overview
                                    </NavLink>
                                    <NavLink
                                        to="/dashboard/adminUsers"
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? "bg-[#404258] text-white shadow-sm"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#6B728E]/60"
                                            }`
                                        }
                                    >
                                        Kelola User
                                    </NavLink>
                                    <NavLink
                                        to="/dashboard/adminCategories"
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? "bg-[#404258] text-white shadow-sm"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#6B728E]/60"
                                            }`
                                        }
                                    >
                                        Kategori
                                    </NavLink>
                                    <NavLink
                                        to="/dashboard/adminCars"
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? "bg-[#404258] text-white shadow-sm"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#6B728E]/60"
                                            }`
                                        }
                                    >
                                        Kelola Alat
                                    </NavLink>
                                    <NavLink
                                        to="/dashboard/adminBooking"
                                        className={({ isActive }) =>
                                            `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                                ? "bg-[#404258] text-white shadow-sm"
                                                : "text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#6B728E]/60"
                                            }`
                                        }
                                    >
                                        Peminjaman
                                    </NavLink>
                                    <NavLink
                                        to="#"
                                        className="flex items-center px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/40 dark:hover:bg-[#6B728E]/60 transition"
                                    >
                                        Laporan
                                    </NavLink>
                                </>
                            )}
                            {user.role === "staff" && (
                                <>
                                    <NavLink to="/dashboard/staff" end className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        Overview
                                    </NavLink>
                                    <NavLink to="/dashboard/bookingStaff" className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        Approve Peminjaman
                                    </NavLink>
                                    <NavLink to="/dashboard/carStaff" className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        Cars
                                    </NavLink>
                                    <NavLink to="/dashboard/reportStaff" className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        Cetak Aktivitas
                                    </NavLink>
                                </>
                            )}
                            {user.role === "customer" && (
                                <>
                                    <NavLink to="/dashboard/customer" end className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        📊 Overview
                                    </NavLink>

                                    <NavLink to="/dashboard/customerCars" className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        📦 Daftar Alat
                                    </NavLink>

                                    <NavLink to="/dashboard/customerbooking" className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        ➕ Pinjam
                                    </NavLink>
                                    <NavLink to="/dashboard/customerhistory" className={({ isActive }) =>
                                        `px-3 py-2.5 rounded-xl ${isActive ? "bg-[#404258] text-white" : "hover:bg-white/40 dark:hover:bg-[#6B728E]/60"}`
                                    }>
                                        🕒 Riwayat
                                    </NavLink>
                                </>
                            )}
                        </nav>
                    </div>
                    <div>
                        <Link
                            to="/"
                            className="w-full flex justify-center px-4 py-2.5 rounded-xl 
                            bg-blue-200 hover:bg-blue-300 text-gray-900
                            dark:bg-[#7077A1] dark:hover:[#424769]
                            dark:text-white my-4 transition"
                        >
                            Back to Home
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
            <main className="w-full h-screen px-2 pt-4 bg-transparent text-gray-900 dark:text-white">
                <Outlet />
            </main>
        </section >
    );
}

export default DashboardLayout;