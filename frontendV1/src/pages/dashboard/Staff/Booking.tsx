import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    getBookings,
    updateBooking,
} from "@/service/BookingService";
import { getCars, getCarUnits } from "@/service/CarService";

function BookingStaff() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any>(null);

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

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
        try {
            setLoading(true);

            const [bookingRes, carRes, unitRes] = await Promise.all([
                getBookings(),
                getCars(),
                getCarUnits(),
            ]);

            const bookingsData = bookingRes?.data?.data ?? [];
            const carsData = carRes?.data?.data ?? [];
            const unitsData = unitRes?.data?.data ?? [];

            const pendingBookings = bookingsData.filter(
                (b: any) => b.status === "pending"
            );

            const merged = pendingBookings.map((b: any) => {
                const unit = unitsData.find(
                    (u: any) => u.id === b.car_unit_id || u.id === b.car_id
                );

                const car = carsData.find(
                    (c: any) => c.id === unit?.car_id
                );

                return {
                    ...b,
                    plate_number: unit?.plate_number,
                    unit_status: unit?.status,
                    car_name: car?.name ?? b.car_name,
                    price_per_day: car?.price_per_day,
                };
            });

            setBookings(merged);
        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Gagal ambil data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= ACTION ================= */
    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            const confirm = await Swal.fire({
                title: "Yakin?",
                text: `Ubah status menjadi ${status}?`,
                icon: "question",
                showCancelButton: true,
            });

            if (!confirm.isConfirmed) return;

            await updateBooking(id, { status });

            Swal.fire("Berhasil", "Status diperbarui", "success");

            setSelected(null);
            fetchData();
        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Gagal update status", "error");
        }
    };

    /* ================= MODAL ================= */
    const Modal = () => {
        if (!selected) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white p-5 rounded w-[500px]">
                    <h2 className="text-lg font-bold mb-3">Detail Booking</h2>

                    <div className="space-y-1 text-sm">
                        <p><b>Booking:</b> {selected.booking_code}</p>
                        <p><b>User:</b> {selected.user_name}</p>
                        <p><b>Email:</b> {selected.user_email}</p>
                        <p><b>Mobil:</b> {selected.car_name}</p>
                        <p><b>Plat:</b> {selected.plate_number}</p>
                        <p><b>Start:</b> {selected.start_time}</p>
                        <p><b>End:</b> {selected.end_time}</p>
                        <p><b>Total:</b> Rp {selected.total_price?.toLocaleString()}</p>
                        <p><b>Status:</b> {selected.status}</p>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => handleUpdateStatus(selected.id, "confirmed")}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                            Confirm
                        </button>

                        <button
                            onClick={() => handleUpdateStatus(selected.id, "cancelled")}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => setSelected(null)}
                            className="ml-auto bg-gray-300 px-3 py-1 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* ================= UI ================= */
    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Booking Pending (Staff)</h1>

            {loading ? (
                <p>Loading...</p>
            ) : bookings.length === 0 ? (
                <p>Tidak ada booking pending</p>
            ) : (
                <table className="w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">ID</th>
                            <th className="p-2">User</th>
                            <th className="p-2">Mobil</th>
                            <th className="p-2">Plat</th>
                            <th className="p-2">Harga/Hari</th>
                            <th className="p-2">Start</th>
                            <th className="p-2">End</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id} className="border-t">
                                <td className="p-2">{b.id}</td>

                                <td className="p-2">
                                    <div>
                                        <div>{b.user_name}</div>
                                        <small className="text-gray-500">
                                            {b.user_email}
                                        </small>
                                    </div>
                                </td>

                                <td className="p-2">{b.car_name}</td>
                                <td className="p-2">{b.plate_number}</td>

                                <td className="p-2">
                                    Rp {b.price_per_day?.toLocaleString()}
                                </td>

                                <td className="p-2">{b.start_time}</td>
                                <td className="p-2">{b.end_time}</td>

                                <td className="p-2">
                                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
                                        {b.status}
                                    </span>
                                </td>

                                <td className="p-2">
                                    <button
                                        onClick={() => setSelected(b)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal />
        </div>
    );
}

export default BookingStaff;