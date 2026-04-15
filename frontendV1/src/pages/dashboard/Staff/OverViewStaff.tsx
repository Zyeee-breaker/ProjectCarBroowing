import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getBookings } from "@/service/BookingService";

function OverViewStaff() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        ongoing: 0,
        done: 0,
        today: 0,
        revenue: 0,
    });

    const [loading, setLoading] = useState(true);

    /* ================= ROLE CHECK ================= */

    /* ================= FETCH ================= */
    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await getBookings();

            // 🔥 FIX: Laravel pagination
            const data = res?.data?.data ?? [];

            const today = new Date().toISOString().split("T")[0];

            let total = data.length;
            let pending = 0;
            let ongoing = 0;
            let done = 0;
            let todayCount = 0;
            let revenue = 0;

            data.forEach((b: any) => {
                const status = b.status?.toLowerCase();

                if (status === "pending") pending++;
                if (status === "ongoing") ongoing++;
                if (status === "done") {
                    done++;
                    revenue += Number(b.total_price || 0);
                }

                if (b.start_time?.startsWith(today)) {
                    todayCount++;
                }
            });

            setStats({
                total,
                pending,
                ongoing,
                done,
                today: todayCount,
                revenue,
            });

        } catch (err: any) {
            console.log("ERROR FETCH:", err?.response?.data || err);

            Swal.fire(
                "Error",
                err?.response?.data?.message || "Gagal ambil data booking",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= CARD ================= */
    const Card = ({ title, value }: any) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col">
            <span className="text-gray-500 text-sm">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    );

    /* ================= UI ================= */
    return (
        <div className="p-5 space-y-5">
            <h1 className="text-2xl font-bold">Overview Staff</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card title="Total Booking" value={stats.total} />
                    <Card title="Pending" value={stats.pending} />
                    <Card title="Ongoing" value={stats.ongoing} />
                    <Card title="Done" value={stats.done} />
                    <Card title="Hari Ini" value={stats.today} />
                    <Card
                        title="Revenue"
                        value={`Rp ${stats.revenue.toLocaleString()}`}
                    />
                </div>
            )}
        </div>
    );
}

export default OverViewStaff;