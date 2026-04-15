import { useEffect, useState } from "react";
import axios from "axios";

function CustomerCars() {
    const [cars, setCars] = useState<any[]>([]);

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/v1",
    });

    const fetchCars = async () => {
        const res = await api.get("/cars");
        setCars(res.data.data);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Cars</h1>

            <div className="grid grid-cols-3 gap-3">
                {cars.map((c) => (
                    <div key={c.id} className="border p-3 rounded">
                        <h2 className="font-bold">{c.name}</h2>
                        <p>Rp {c.price_per_day}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerCars;