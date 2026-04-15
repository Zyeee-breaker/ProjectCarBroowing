import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getCars, getCarUnits } from "@/service/CarService";

function CarStaff() {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthUser = () => {
        return JSON.parse(localStorage.getItem("user") || "{}");
    };

    /* ================= ROLE CHECK ================= */
    useEffect(() => {
        const user = getAuthUser();

        if (!user || !user.role) {
            Swal.fire("Error", "User tidak ditemukan", "error");
            window.location.href = "/login";
            return;
        }

        if (user.role !== "staff") {
            Swal.fire("Akses Ditolak", "Hanya staff yang bisa masuk", "warning");
            window.location.href = "/";
            return;
        }
    }, []);

    /* ================= FETCH ================= */
    const fetchData = async () => {
        try {
            setLoading(true);

            const [carRes, unitRes] = await Promise.all([
                getCars(),
                getCarUnits(),
            ]);

            const carsData = carRes?.data?.data ?? [];
            const unitsData = unitRes?.data?.data ?? [];

            /* 🔥 JOIN CAR + UNIT */
            const merged = carsData.map((car: any) => {
                const units = unitsData.filter(
                    (u: any) => u.car_id === car.id
                );

                return {
                    ...car,
                    units,
                };
            });

            setCars(merged);

        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Gagal ambil data mobil", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= UI ================= */
    return (
        <div className="p-5 space-y-5">
            <h1 className="text-2xl font-bold">Data Mobil (Staff)</h1>

            {loading ? (
                <p>Loading...</p>
            ) : cars.length === 0 ? (
                <p>Tidak ada data mobil</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-3"
                        >
                            {/* CAR INFO */}
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {car.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Rp {car.price_per_day?.toLocaleString()} / hari
                                </p>
                            </div>

                            {/* UNIT LIST */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-500">
                                    Unit
                                </h4>

                                {car.units.length === 0 ? (
                                    <p className="text-sm text-gray-400">
                                        Tidak ada unit
                                    </p>
                                ) : (
                                    car.units.map((u: any) => (
                                        <div
                                            key={u.id}
                                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded"
                                        >
                                            <span>{u.plate_number}</span>

                                            <span
                                                className={`text-xs px-2 py-1 rounded ${u.status === "available"
                                                        ? "bg-green-200 text-green-800"
                                                        : u.status === "booked"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : "bg-red-200 text-red-800"
                                                    }`}
                                            >
                                                {u.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CarStaff;