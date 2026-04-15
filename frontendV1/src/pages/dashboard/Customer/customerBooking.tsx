import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function CustomerBooking() {
    const [cars, setCars] = useState<any[]>([]);
    const [carId, setCarId] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/v1",
        headers: { Authorization: `Bearer ${token}` },
    });

    const fetchCars = async () => {
        const res = await api.get("/cars");
        setCars(res.data.data);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleBooking = async () => {
        try {
            await api.post("/bookings", {
                car_id: carId,
                start_time: start,
                end_time: end,
            });

            Swal.fire("Success", "Booking berhasil", "success");
        } catch {
            Swal.fire("Error", "Booking gagal", "error");
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Booking Mobil</h1>

            <select
                className="border p-2 w-full mb-2"
                onChange={(e) => setCarId(e.target.value)}
            >
                <option>Pilih Mobil</option>
                {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            <input type="datetime-local" className="border p-2 w-full mb-2"
                onChange={(e) => setStart(e.target.value)}
            />

            <input type="datetime-local" className="border p-2 w-full mb-2"
                onChange={(e) => setEnd(e.target.value)}
            />

            <button
                onClick={handleBooking}
                className="bg-blue-500 text-white px-3 py-2 rounded"
            >
                Booking
            </button>
        </div>
    );
}

export default CustomerBooking;