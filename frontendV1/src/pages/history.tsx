import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { getMyBooking } from "@/service/BookingService";
import { getAllUsers } from "@/service/UserService";
import {
    getCarCategories,
    getCars,
    getCarUnits,
} from "@/service/CarService";

type Booking = any;

function History() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [cars, setCars] = useState<any[]>([]);
    const [carUnits, setCarUnits] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAll = async () => {
        setLoading(true);

        try {
            const [bookingRes, carRes, unitRes, userRes, catRes] =
                await Promise.all([
                    getMyBooking(),
                    getCars(),
                    getCarUnits(),
                    getAllUsers(),
                    getCarCategories(),
                ]);

            setBookings(bookingRes.data.data || []);
            setCars(carRes.data.data || []);
            setCarUnits(unitRes.data.data || []);
            setUsers(userRes.data.data || []);
            setCategories(catRes.data.data || []);
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Tidak bisa mengambil data",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ================= HELPERS =================

    const getCarUnit = (car_unit_id: number) => {
        return carUnits.find((u) => u.id === car_unit_id);
    };

    const getCarFromUnit = (car_unit_id: number) => {
        const unit = getCarUnit(car_unit_id);
        if (!unit) return null;

        return cars.find((c) => c.id === unit.car_id);
    };

    const getCategoryFromUnit = (car_unit_id: number) => {
        const unit = getCarUnit(car_unit_id);
        if (!unit) return null;

        const car = cars.find((c) => c.id === unit.car_id);
        if (!car) return null;

        return categories.find((cat) => cat.id === car.category_id);
    };

    const getUser = (user_id: number) => {
        return users.find((u) => u.id === user_id);
    };

    // ================= DETAIL MODAL =================

    const showDetail = (b: any) => {
        const unit = getCarUnit(b.car_unit_id);
        const car = getCarFromUnit(b.car_unit_id);
        const category = getCategoryFromUnit(b.car_unit_id);
        const user = getUser(b.user_id);

        Swal.fire({
            title: "Booking Detail",
            html: `
                <div style="text-align:left; font-size:14px">

                    <p><b>🚗 Unit:</b> ${unit?.name || "-"}</p>

                    <p><b>🚙 Car:</b> ${car?.name || "-"}</p>

                    <p><b>👤 User:</b> ${user?.name || "-"}</p>

                    <p><b>📂 Category:</b> ${category?.name || "-"}</p>

                    <hr/>

                    <p><b>📅 Start:</b> ${b.start_time}</p>
                    <p><b>📅 End:</b> ${b.end_time}</p>

                    <hr/>

                    <p><b>💰 Total:</b> Rp ${Number(b.total_price).toLocaleString()}</p>

                    <p><b>Status:</b> ${b.status}</p>

                    <p><b>Code:</b> ${b.booking_code}</p>

                </div>
            `,
            confirmButtonText: "Close",
        });
    };

    // ================= UI =================

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">History Booking</h1>

            {loading && <p>Loading...</p>}

            {!loading && bookings.length === 0 && (
                <p className="text-gray-500">Belum ada booking</p>
            )}

            <div className="grid gap-4">
                {bookings.map((b: any) => {
                    const unit = getCarUnit(b.car_unit_id);
                    const car = getCarFromUnit(b.car_unit_id);
                    const user = getUser(b.user_id);

                    return (
                        <div
                            key={b.id}
                            onClick={() => showDetail(b)}
                            className="cursor-pointer border rounded-lg p-4 shadow bg-white hover:shadow-lg transition"
                        >
                            <h2 className="font-bold text-lg">
                                🚗 {car?.name || unit?.name || "Unknown"}
                            </h2>

                            <p className="text-sm text-gray-500">
                                👤 {user?.name || "-"}
                            </p>

                            <p className="text-sm">
                                {b.start_time} → {b.end_time}
                            </p>

                            <p className="font-semibold">
                                Rp {Number(b.total_price).toLocaleString()}
                            </p>

                            <span
                                className={`text-xs px-2 py-1 rounded ${b.status === "paid"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-yellow-200 text-yellow-800"
                                    }`}
                            >
                                {b.status}
                            </span>

                            <p className="text-xs text-gray-400 mt-2">
                                Klik untuk detail
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default History;