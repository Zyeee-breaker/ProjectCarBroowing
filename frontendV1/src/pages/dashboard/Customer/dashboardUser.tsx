import { useEffect, useState } from "react";
import axios from "axios";

function DashboardUser() {
    const [bookings, setBookings] = useState<any[]>([]);
    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/v1",
        headers: { Authorization: `Bearer ${token}` },
    });

    const fetchData = async () => {
        const res = await api.get("/bookings/my-bookings");
        setBookings(res.data.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const total = bookings.length;
    const active = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled").length;
    const done = bookings.filter(b => b.status === "completed").length;

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Dashboard User</h1>

            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 bg-gray-100 rounded">Total: {total}</div>
                <div className="p-3 bg-gray-100 rounded">Active: {active}</div>
                <div className="p-3 bg-gray-100 rounded">Done: {done}</div>
            </div>
        </div>
    );
}

export default DashboardUser;