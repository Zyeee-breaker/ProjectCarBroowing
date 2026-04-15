import { useEffect, useState } from "react";
import axios from "axios";

function CustomerHistory() {
    const [bookings, setBookings] = useState<any[]>([]);

    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/v1",
        headers: { Authorization: `Bearer ${token}` },
    });

    const fetchHistory = async () => {
        const res = await api.get("/bookings/my-bookings");
        setBookings(res.data.data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">History Booking</h1>

            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th>ID</th>
                        <th>Mobil</th>
                        <th>Status</th>
                        <th>Start</th>
                        <th>End</th>
                    </tr>
                </thead>

                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id} className="border-t">
                            <td>{b.id}</td>
                            <td>{b.car_name}</td>
                            <td>{b.status}</td>
                            <td>{b.start_time}</td>
                            <td>{b.end_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerHistory;