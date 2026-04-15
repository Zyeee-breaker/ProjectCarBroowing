import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { getCar, getCarUnits } from "@/service/CarService";
import { createBooking } from "@/service/BookingService";
import { createPayment } from "@/service/PaymentService";

type Car = {
    id: number;
    name: string;
    price_per_day?: number;
};

type CarUnit = {
    id: number;
    car_id: number;
    status: "available" | "maintenance" | "outgarage";
};

function Booking() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const carId = params.get("car_id");

    const [car, setCar] = useState<Car | null>(null);
    const [units, setUnits] = useState<CarUnit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [isForOther, setIsForOther] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<
        "now" | "pickup" | "return"
    >("pickup");

    const [paymentProvider, setPaymentProvider] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (carId) fetchData();
    }, [carId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!isForOther) {
            setCustomerName(user.name || "");
            setCustomerPhone(user.phone || "");
            setCustomerAddress(user.address || "");
        } else {
            setCustomerName("");
            setCustomerPhone("");
            setCustomerAddress("");
        }
    }, [isForOther]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const carRes = await getCar(Number(carId));
            const unitRes = await getCarUnits();

            setCar(carRes.data.data || carRes.data);

            const allUnits = unitRes.data.data || unitRes.data;

            const filtered = allUnits.filter(
                (u: CarUnit) =>
                    u.car_id === Number(carId) &&
                    u.status === "available"
            );

            setUnits(filtered);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedUnit) {
            Swal.fire("Pilih unit dulu!", "", "warning");
            return;
        }

        if (!startDate || !endDate) {
            Swal.fire("Tanggal belum lengkap!", "", "warning");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("access_token") || "{}");

            if (!user.id) {
                Swal.fire("Harus login dulu!", "", "warning");
                return;
            }

            // HITUNG HARI
            const s = new Date(startDate);
            const e = new Date(endDate);

            const totalDays = Math.max(
                1,
                Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
            );

            const pricePerDay = 100000; // bisa ambil dari API nanti
            const totalPrice = totalDays * pricePerDay;

            const bookingPayload = {
                booking_code: "BOOK-" + Date.now(),

                user_id: user.id,
                created_by_user_id: user.id,

                car_unit_id: selectedUnit,

                car_name: car?.name || "Unknown Car",
                car_price_per_day: pricePerDay,

                customer_name: customerName || user.name,
                customer_phone: customerPhone || user.phone,
                customer_address: customerAddress || user.address,

                start_time: startDate + " 00:00:00",
                end_time: endDate + " 00:00:00",

                total_days: totalDays,
                price_per_day: pricePerDay,
                total_price: totalPrice,

                late_fee: 0,
                description_late: "",

                status: "pending",
                qr_code: "QR-" + Math.random().toString(36).substring(2, 10),
            };

            console.log("PAYLOAD BOOKING:", bookingPayload);

            const res = await createBooking(bookingPayload);
            const bookingId = res.data?.data?.id || res.data?.id;

            // ================= PAYMENT =================
            let paymentPayload: any = {
                booking_id: bookingId,
                amount: totalPrice,
                paid_amount: 0,
                remaining_amount: totalPrice,
            };

            if (paymentMethod === "now") {
                if (!paymentProvider) {
                    Swal.fire("Pilih provider pembayaran!", "", "warning");
                    return;
                }

                paymentPayload.method = "online";
                paymentPayload.provider = paymentProvider;
                paymentPayload.status = "pending";
            }

            if (paymentMethod === "pickup") {
                paymentPayload.method = "cash";
                paymentPayload.provider = "onsite";
                paymentPayload.status = "pending";
            }

            if (paymentMethod === "return") {
                paymentPayload.method = "pay_later";
                paymentPayload.provider = "manual";
                paymentPayload.status = "pending";
            }

            await createPayment(bookingId, paymentPayload);

            Swal.fire("Booking berhasil 🚗", "", "success");
            navigate("/history");

        } catch (err: any) {
            console.error("ERROR FULL:", err?.response?.data);

            Swal.fire(
                "Error",
                JSON.stringify(err?.response?.data, null, 2),
                "error"
            );
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <section className="min-h-screen bg-white dark:bg-[#222831] text-black dark:text-white p-6">

            <button
                onClick={() => navigate(-1)}
                className="mb-4 bg-gray-300 px-4 py-1 rounded"
            >
                ← Kembali
            </button>

            <h1 className="text-2xl font-bold mb-4">
                Booking: {car?.name}
            </h1>

            {/* UNIT */}
            <div className="mb-6">
                <h2 className="font-semibold mb-2">Pilih Unit</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {units.map((unit) => (
                        <button
                            key={unit.id}
                            onClick={() => setSelectedUnit(unit.id)}
                            className={`p-3 rounded border ${selectedUnit === unit.id
                                ? "bg-green-500 text-white"
                                : "bg-gray-100"
                                }`}
                        >
                            Unit #{unit.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* FORM */}
            <div className={`p-4 rounded-xl border ${!selectedUnit ? "opacity-50 pointer-events-none" : ""}`}>
                <h2 className="font-semibold mb-3">Form Booking</h2>

                <div className="flex flex-col gap-3">

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 border rounded"
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 border rounded"
                    />

                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="p-2 border rounded"
                    >
                        <option value="now">Bayar Sekarang</option>
                        <option value="pickup">Bayar Saat Ambil</option>
                        <option value="return">Bayar Setelah Pengembalian</option>
                    </select>

                    {paymentMethod === "now" && (
                        <select
                            value={paymentProvider}
                            onChange={(e) => setPaymentProvider(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="">-- pilih provider --</option>
                            <option value="midtrans">Midtrans</option>
                            <option value="bank_transfer">Transfer Bank</option>
                            <option value="ewallet">E-Wallet</option>
                        </select>
                    )}

                    <button
                        onClick={handleBooking}
                        className="bg-[#404258] text-white py-2 rounded"
                    >
                        Booking Sekarang
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Booking;