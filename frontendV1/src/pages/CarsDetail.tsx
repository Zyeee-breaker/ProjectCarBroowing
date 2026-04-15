import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getCar,
    getCarUnits,
    getCarImagesByCar,
} from "@/service/CarService";
type Car = {
    id: number;
    name: string;
    brand: string;
    model?: string;
    year?: string;
    price?: number;
    price_per_day?: number;
};
type CarUnit = {
    id: number;
    car_id: number;
    status: "available" | "maintenance" | "outgarage";
};
type CarImage = {
    id: number;
    car_id: number;
    path: string;
};
const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";
function CarsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car | null>(null);
    const [units, setUnits] = useState<CarUnit[]>([]);
    const [images, setImages] = useState<CarImage[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (id) fetchData();
    }, [id]);
    const fetchData = async () => {
        try {
            setLoading(true);
            // ✅ ambil car by id
            const carRes = await getCar(Number(id));
            // ✅ ambil unit (boleh semua lalu filter)
            const unitRes = await getCarUnits();
            // ✅ ambil image berdasarkan car id
            const imageRes = await getCarImagesByCar(Number(id));
            setImages(imageRes.data);
            setCar(carRes.data.data || carRes.data);
            const allUnits = unitRes.data.data || unitRes.data;
            setUnits(allUnits.filter((u: CarUnit) => u.car_id === Number(id)));
            // ⚠️ tergantung backend:
            // kalau API return 1 object → bungkus array
            const imgData = imageRes.data.data || imageRes.data;
            setImages(Array.isArray(imgData) ? imgData : [imgData]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const getImageUrl = (path: string) => {
        if (!path) return "https://via.placeholder.com/400";
        if (path.startsWith("http")) return path;
        return BASE_IMAGE_URL + path;
    };
    const getCarStatus = () => {
        if (units.some((u) => u.status === "available")) return "available";
        if (units.some((u) => u.status === "maintenance")) return "maintenance";
        if (units.some((u) => u.status === "outgarage")) return "outgarage";
        return "unknown";
    };
    const handleBooking = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            Swal.fire({
                title: "Harus Login!",
                text: "Login dulu 🚗",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Register",
                showCloseButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate("/register");
                }
            });
            return;
        }
        navigate(`/booking?car_id=${id}`);
    };
    if (loading) return <p className="p-6">Loading...</p>;
    if (!car) {
        return (
            <div className="p-6">
                <p>Mobil tidak ditemukan 😢</p>
                <button
                    onClick={() => navigate("/cars")}
                    className="mt-3 bg-gray-300 px-4 py-1 rounded"
                >
                    Kembali
                </button>
            </div>
        );
    }
    return (
        <section className="min-h-screen bg-white dark:bg-[#222831] text-gray-900 dark:text-white">
            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#222831]/80 backdrop-blur border-b px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 transition"
                >
                    ← Kembali
                </button>
                <h2 className="font-semibold text-lg">Detail Mobil</h2>
                <div />
            </div>
            <div className="p-6 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* IMAGE SECTION */}
                    <div>
                        {/* MAIN IMAGE */}
                        <div className="overflow-hidden rounded-2xl shadow-md">
                            <img
                                src={
                                    images.length > 0
                                        ? getImageUrl(images[0].path)
                                        : "https://via.placeholder.com/400"
                                }
                                className="w-full h-80 object-cover hover:scale-105 transition duration-300"
                            />
                        </div>
                        {/* THUMBNAILS */}
                        <div className="flex gap-3 mt-4 overflow-x-auto">
                            {images.map((img) => (
                                <img
                                    key={img.id}
                                    src={getImageUrl(img.path)}
                                    className="w-24 h-20 object-cover rounded-lg cursor-pointer border hover:scale-105 transition"
                                />
                            ))}
                        </div>
                    </div>
                    {/* DETAIL SECTION */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {car.name}
                            </h1>
                            <p className="text-gray-500 mb-3">
                                {car.brand} • {car.model} • {car.year}
                            </p>
                            {/* STATUS BADGE */}
                            <div className="mb-4">
                                <span
                                    className={`text-sm px-3 py-1 rounded-full font-medium
                                ${getCarStatus() === "available" ? "bg-green-100 text-green-600" : ""}
                                ${getCarStatus() === "maintenance" ? "bg-yellow-100 text-yellow-600" : ""}
                                ${getCarStatus() === "outgarage" ? "bg-red-100 text-red-600" : ""}
                            `}
                                >
                                    {getCarStatus()}
                                </span>
                            </div>
                            {/* PRICE */}
                            {car.price_per_day && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500">Harga sewa</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        Rp {car.price_per_day.toLocaleString()}
                                        <span className="text-base text-gray-500"> / hari</span>
                                    </p>
                                </div>
                            )}
                            {/* INFO CARD */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-100 dark:bg-[#393E46] p-3 rounded-xl text-center">
                                    <p className="text-sm text-gray-500">Brand</p>
                                    <p className="font-semibold">{car.brand}</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-[#393E46] p-3 rounded-xl text-center">
                                    <p className="text-sm text-gray-500">Model</p>
                                    <p className="font-semibold">{car.model}</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-[#393E46] p-3 rounded-xl text-center">
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="font-semibold">{car.year}</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-[#393E46] p-3 rounded-xl text-center">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-semibold">{getCarStatus()}</p>
                                </div>
                            </div>
                        </div>
                        {/* CTA */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleBooking}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                Booking Sekarang 🚗
                            </button>
                            <button
                                onClick={() => navigate("/cars")}
                                className="px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 transition"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CarsDetail;