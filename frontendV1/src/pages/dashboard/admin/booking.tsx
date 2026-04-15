import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking,
} from "@/service/BookingService";

import {
    getCars,
    getCarUnits,
} from "@/service/CarService";

import { getAllUsers } from "@/service/UserService";

import { createPayment } from "@/service/PaymentService";

import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaTimes,
    FaCalendarAlt,
    FaTimesCircle,
    FaSearch,
} from "react-icons/fa";
import FormattedDate from "@/components/FormatedDate";

/* ================= TYPES ================= */
type Booking = {
    id: number;
    user_id: number;
    car_unit_id: number;

    booking_code?: string;

    car_name?: string;
    car_price_per_day?: number;

    start_time: string;
    end_time: string;

    total_days?: number;
    total_price: number;

    qr_code?: string;
    status: string;

    // 🔥 TAMBAHAN (FIX ERROR)
    plate_number?: string;
    unit_status?: string;

    user_name?: string;
    user_email?: string;
};

type BookingForm = {
    car_unit_id: string;
    start_time: string;
    end_time: string;
    total_price: string;
    status: string;

    payment_amount: string;
    payment_method: string;
    payment_status: string;

    // 🔥 TAMBAHAN SESUAI MIGRATION
    booking_code: string;
    user_id: string;
    created_by_user_id: string;

    car_name: string;
    car_price_per_day: string;

    customer_name: string;
    customer_phone: string;
    customer_address: string;

    total_days: string;
    price_per_day: string;

    late_fee: string;
    description_late: string;

    returned_at: string;
    qr_code: string;
};

function AdminBooking() {
    const getAuthUser = () => {
        return JSON.parse(localStorage.getItem("user") || "{}");
    };
    const generateBookingCode = () => {
        return "BOOK-" + Date.now();
    };
    const generateQRCode = () => {
        return "QR-" + Math.random().toString(36).substring(2, 10);
    };

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [enrichedUnits, setEnrichedUnits] = useState<any[]>([]);

    const [selected, setSelected] = useState<Booking | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const perPage = 10;
    const currentPage = Number(searchParams.get("page")) || 1;

    const setCurrentPage = (page: number) => {
        setSearchParams({ page: String(page) });
    };
    const [form, setForm] = useState<BookingForm>({
        car_unit_id: "",
        start_time: "",
        end_time: "",
        total_price: "",
        status: "pending",

        payment_amount: "",
        payment_method: "",
        payment_status: "pending",

        // 🔥 NEW
        booking_code: "",
        user_id: "",
        created_by_user_id: "",

        car_name: "",
        car_price_per_day: "",

        customer_name: "",
        customer_phone: "",
        customer_address: "",

        total_days: "",
        price_per_day: "",

        late_fee: "0",
        description_late: "",

        returned_at: "",
        qr_code: "",
    });
    useEffect(() => {
        if (!form.start_time || !form.end_time || !form.price_per_day) return;

        const s = new Date(form.start_time);
        const e = new Date(form.end_time);

        const diff = Math.max(
            1,
            Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
        );

        const total = diff * Number(form.price_per_day);

        setForm((prev) => ({
            ...prev,
            total_days: String(diff),
            total_price: String(total),
        }));

    }, [form.start_time, form.end_time, form.price_per_day]);
    /* ================= FETCH ================= */
    const fetchData = async () => {
        try {
            const [bookingRes, carRes, unitRes, userRes] = await Promise.all([
                getBookings(),
                getCars(),
                getCarUnits(),
                getAllUsers(), // 🔥 TAMBAH USER
            ]);

            const bookingsData = bookingRes?.data?.data ?? [];
            const carsData = carRes?.data?.data ?? [];
            const unitsData = unitRes?.data?.data ?? [];
            const usersData = userRes?.data?.data ?? [];

            setUsers(usersData);

            /* ================= JOIN SEMUA ================= */
            const mergedBookings = bookingsData.map((b: any) => {
                const unit = unitsData.find(
                    (u: any) =>
                        u.id === b.car_unit_id || u.id === b.car_id // 🔥 HANDLE DUA CASE
                );

                const car = carsData.find(
                    (c: any) => c.id === unit?.car_id
                );

                const user = usersData.find(
                    (u: any) => u.id === b.user_id
                );

                return {
                    ...b,

                    // USER
                    user_name: user?.name,
                    user_email: user?.email,

                    // UNIT
                    plate_number: unit?.plate_number,
                    unit_status: unit?.status,

                    // CAR
                    car_name: car?.name ?? b.car_name,
                    car_price_per_day: car?.price_per_day ?? b.car_price_per_day,
                };
            });

            setBookings(mergedBookings);

            /* ================= ENRICHED UNIT ================= */
            const mergedUnits = unitsData.map((unit: any) => {
                const car = carsData.find((c: any) => c.id === unit.car_id);

                return {
                    ...unit,
                    car_name: car?.name,
                    price_per_day: car?.price_per_day,
                };
            });

            setEnrichedUnits(mergedUnits);

        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Gagal ambil data", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // FILTER DULU
    const filteredBookings = bookings.filter((b) => {
        const matchSearch =
            String(b.user_id).includes(search) ||
            String(b.car_unit_id).includes(search) ||
            b.status.toLowerCase().includes(search.toLowerCase());

        const matchStart =
            startDate ? new Date(b.start_time) >= new Date(startDate) : true;

        const matchEnd =
            endDate ? new Date(b.end_time) <= new Date(endDate) : true;

        return matchSearch && matchStart && matchEnd;
    });

    const totalPages = Math.ceil(filteredBookings.length / perPage);

    const currentBookings = filteredBookings.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );
    /* ================= SAVE ================= */
    const handleSave = async () => {
        try {
            setLoading(true);

            const user = getAuthUser();

            const payload = {
                booking_code: generateBookingCode(),

                user_id: user.id,
                created_by_user_id: user.id,

                car_unit_id: Number(form.car_unit_id),

                car_name: form.car_name,
                car_price_per_day: Number(form.car_price_per_day),

                customer_name: form.customer_name,
                customer_phone: form.customer_phone,
                customer_address: form.customer_address,

                start_time: form.start_time,
                end_time: form.end_time,

                total_days: Number(form.total_days),

                price_per_day: Number(form.price_per_day),
                total_price: Number(form.total_price),

                late_fee: Number(form.late_fee),
                description_late: form.description_late,

                status: form.status,

                returned_at: form.returned_at || null,
                qr_code: generateQRCode(),
            };

            let bookingId;

            if (mode === "create") {
                const res = await createBooking(payload);
                bookingId = res?.data?.data?.id;
            } else {
                if (!selected) return;
                await updateBooking(selected.id, payload);
                bookingId = selected.id;
            }

            if (form.payment_amount && form.payment_method) {
                await createPayment({
                    booking_id: bookingId,
                    amount: Number(form.payment_amount),
                    method: form.payment_method,
                    status: form.payment_status,
                });
            }

            Swal.fire("Success", "Booking berhasil", "success");
            setModalOpen(false);
            fetchData();

        } catch (err: any) {
            Swal.fire("Error", err?.response?.data?.message || "Gagal", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCar = (id: string) => {
        const selectedCar = enrichedUnits.find((u) => u.id == id);

        if (!selectedCar) return;

        setForm({
            ...form,
            car_unit_id: id,
            car_name: selectedCar.car_name,
            car_price_per_day: String(selectedCar.price_per_day),
            price_per_day: String(selectedCar.price_per_day),
        });
    };

    /* ================= UI ================= */
    return (
        <section className="p-4 space-y-6">
            <div className="flex w-full justify-between items-center w-full">
                <div className="flex flex-col items-start gap-3">

                    <span className="flex gap-2 items-center">
                        <FaCalendarAlt className="text-4xl font-serif" />
                        <h2 className="font-serif text-2xl">
                            Bookings
                        </h2>
                    </span>
                    <div className="flex flex-wrap gap-3 w-full">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-[250px]">
                            <FaSearch className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent outline-none w-full text-sm"
                            />

                            {search && (
                                <FaTimes
                                    onClick={() => setSearch("")}
                                    className="cursor-pointer text-gray-400 hover:text-black"
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <FaCalendarAlt className="text-gray-400" />

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent outline-none text-sm"
                            />

                            <span className="text-gray-400 text-sm">-</span>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent outline-none text-sm"
                            />
                        </div>
                        {(search || startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700"
                                title="Reset filter"
                            >
                                <FaTimesCircle />
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-32 h-auto flex justify-center">
                    <button className="flex items-center px-4 py-2 rounded-xl bg-[#404258] text-white shadow hover:opacity-90"
                        onClick={() => setModalOpen(true)}
                    >
                        <FaPlus /> booking
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto h-[70vh]">
                <table className="w-full text-sm text-left rounded-lg border border-gray-200 dark:border-gray-700">

                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        <tr>
                            <th className="p-3">No.</th>
                            <th className="p-3">Code</th>
                            <th className="p-3">Car</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Start</th>
                            <th className="p-3">End</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">QR</th>
                            <th className="p-3">Aksi</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-700 dark:text-gray-200">
                        {currentBookings.map((b, index) => (
                            <tr
                                key={b.id}
                                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <td className="p-3">
                                    {(currentPage - 1) * perPage + index + 1}
                                </td>
                                <td className="p-3 font-semibold whitespace-nowrap">
                                    {b.booking_code}
                                </td>

                                <td className="p-3 min-w-[160px]">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{b.car_name}</span>
                                        <small className="text-gray-500 dark:text-gray-400">
                                            {b.plate_number}
                                        </small>
                                    </div>
                                </td>

                                <td className="p-3 min-w-[180px]">
                                    <div className="flex flex-col">
                                        <span>{b.user_name}</span>
                                        <small className="text-gray-400">
                                            {b.user_email}
                                        </small>
                                    </div>
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span>
                                            Rp {b.total_price?.toLocaleString()}
                                        </span>
                                        <small className="text-gray-400">
                                            / {b.car_price_per_day}
                                        </small>
                                    </div>
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                    {FormattedDate(b.start_time)}
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                    {FormattedDate(b.end_time)}
                                </td>

                                <td className="p-3">
                                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                        {b.status}
                                    </span>
                                </td>

                                <td className="p-3">
                                    {b.qr_code ? (
                                        <span className="text-green-600 dark:text-green-400 text-xs">
                                            Ready
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td className="p-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelected(b)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteBooking(b.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-6 text-sm">
                <div className="text-gray-600">
                    <span>
                        Showing{" "}
                        <b>{(currentPage - 1) * perPage + 1}</b> to{" "}
                        <b>
                            {Math.min(currentPage * perPage, filteredBookings.length)}
                        </b>{" "}
                        of <b>{filteredBookings.length}</b> bookings
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* MODAL (tetap simple, tidak diubah besar) */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                    <div className="w-[95%] max-w-xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-5 rounded-xl shadow-lg space-y-5">

                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Booking</h3>
                            <FaTimes
                                onClick={() => setModalOpen(false)}
                                className="cursor-pointer text-gray-500 hover:text-red-500"
                            />
                        </div>

                        {/* ================= MOBIL ================= */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mobil</label>
                            <select
                                className="input"
                                onChange={(e) => handleSelectCar(e.target.value)}
                            >
                                <option value="">Pilih Mobil</option>
                                {enrichedUnits.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.car_name} - {u.plate_number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ================= CUSTOMER ================= */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Customer
                            </h4>

                            <input
                                placeholder="Nama"
                                className="input"
                                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                            />

                            <input
                                placeholder="No HP"
                                className="input"
                                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                            />

                            <textarea
                                placeholder="Alamat"
                                className="input"
                                onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                            />
                        </div>

                        {/* ================= TANGGAL ================= */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Waktu Sewa
                            </h4>

                            <input
                                type="datetime-local"
                                className="input"
                                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                            />

                            <input
                                type="datetime-local"
                                className="input"
                                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                            />
                        </div>

                        {/* ================= SUMMARY ================= */}
                        <div className="grid grid-cols-3 gap-2">
                            <input value={form.total_days} readOnly className="input-readonly" placeholder="Days" />
                            <input value={form.price_per_day} readOnly className="input-readonly" placeholder="Price" />
                            <input value={form.total_price} readOnly className="input-readonly" placeholder="Total" />
                        </div>

                        {/* ================= LATE ================= */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Keterlambatan
                            </h4>

                            <input
                                placeholder="Late Fee"
                                className="input"
                                onChange={(e) => setForm({ ...form, late_fee: e.target.value })}
                            />

                            <input
                                placeholder="Deskripsi"
                                className="input"
                                onChange={(e) => setForm({ ...form, description_late: e.target.value })}
                            />
                        </div>

                        {/* ================= STATUS ================= */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Status
                            </h4>

                            <select
                                className="input"
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="pending">pending</option>
                                <option value="approved">approved</option>
                                <option value="ongoing">ongoing</option>
                                <option value="done">done</option>
                                <option value="cancelled">cancelled</option>
                            </select>

                            <input
                                type="datetime-local"
                                className="input"
                                onChange={(e) => setForm({ ...form, returned_at: e.target.value })}
                            />
                        </div>

                        {/* ================= PAYMENT ================= */}
                        <div className="space-y-2 border-t pt-3 border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Payment
                            </h4>

                            <input
                                placeholder="Amount"
                                className="input"
                                onChange={(e) => setForm({ ...form, payment_amount: e.target.value })}
                            />

                            <input
                                placeholder="Method"
                                className="input"
                                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                            />

                            <select
                                className="input"
                                onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
                            >
                                <option value="pending">pending</option>
                                <option value="paid">paid</option>
                                <option value="partial">partial</option>
                            </select>
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded transition"
                        >
                            {loading ? "Loading..." : "Simpan"}
                        </button>

                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminBooking;