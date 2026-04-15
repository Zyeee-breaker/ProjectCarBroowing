import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getCars, getCarUnits } from "@/service/CarService";
import { FaCarAlt, FaExclamationTriangle } from "react-icons/fa";
import CarsIcons from "@/assets/IconsCars.png";
import BackgroundCar from "@/assets/Video/backgoundweb.mp4";
type Car = {
    id: number;
    name: string;
    brand: string;
    price?: number;
    price_per_day?: number;
    image?: string;
    path?: string; // untuk jaga-jaga dari backend
};
type CarUnit = {
    id: number;
    car_id: number;
    status: "available" | "maintenance" | "outgarage";
};
function Home() {
    const [cars, setCars] = useState<Car[]>([]);
    const [units, setUnits] = useState<CarUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchCars();
    }, []);
    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await getCars();
            const data = res.data.data || res.data;
            const unitRes = await getCarUnits();
            const unitData = unitRes.data.data || unitRes.data;
            if (!Array.isArray(data)) throw new Error("Cars bukan array");
            if (!Array.isArray(unitData)) throw new Error("Units bukan array");
            setCars(data);
            setUnits(unitData);
            setError(false);
        } catch (err) {
            console.error("ERROR FETCH:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    // ✅ STATUS PER MOBIL
    const getCarStatus = (carId: number) => {
        const carUnits = units.filter((u) => u.car_id === carId);

        if (carUnits.some((u) => u.status === "available")) return "available";
        if (carUnits.some((u) => u.status === "maintenance")) return "maintenance";
        if (carUnits.some((u) => u.status === "outgarage")) return "outgarage";

        return "unknown";
    };
    // ✅ FIX HANDLE READ
    const handleRead = (car: Car) => {
        navigate(`/cars?car_id=${car.id}`);
    };

    const handleBooking = (car: Car) => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                title: "Harus Login!",
                text: "Kamu harus login dulu untuk booking 🚗",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Register",
                showCloseButton: true,
            }).then((result) => {

                if (result.isConfirmed) {
                    // ✅ klik Login
                    navigate("/login");

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // ✅ klik Register
                    navigate("/register");

                } else if (
                    result.dismiss === Swal.DismissReason.close ||
                    result.dismiss === Swal.DismissReason.backdrop
                ) {
                    return;
                }

            });
            return;
        }

        navigate(`/booking?car_id=${car.id}`);
    };

    return (
        <>
            {/* HERO */}
            <section className="relative w-full h-screen overflow-hidden">
                <video
                    className="absolute w-full h-full object-cover"
                    src={BackgroundCar}
                    autoPlay
                    loop
                    muted
                />

                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black via-black/20 to-transparent dark:to-[#222831]"></div>

                <div className="relative z-10 flex items-center h-full px-6">
                    <div>
                        <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
                            <img src={CarsIcons} className="w-20 invert object-contain" />
                            Cars Broowing
                        </h1>

                        <p className="text-gray-300 mt-4 mb-6">
                            Pinjam mobil cepat & terpercaya 
                        </p>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("cars-section")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="bg-[#404258] hover:bg-[#2f3147] text-white px-6 py-2 rounded-lg"
                        >
                            Lihat Mobil
                        </button>
                    </div>
                </div>
            </section>
            {/* CARS */}
            <section
                id="cars-section"
                className="px-6 py-16 bg-gradient-to-b from-black via-black/50 to-white dark:to-[#222831] text-gray-900 dark:text-white"
            >
                <div className="flex justify-center items-center text-center mb-10">
                    <FaCarAlt className="text-3xl text-blue-500" />
                    <h1 className="text-3xl font-bold text-white">
                        Rental Mobil
                    </h1>
                </div>

                {loading && <p className="text-center">Loading...</p>}

                {error && (
                    <div className="text-center text-red-500">
                        <FaExclamationTriangle />
                        <button onClick={fetchCars}>Refresh</button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
                        {cars.map((car) => {
                            const status = getCarStatus(car.id);

                            return (
                                <div
                                    key={car.id}
                                    className="bg-[#E8F9FF] dark:bg-[#393E46] rounded-xl shadow-lg overflow-hidden"
                                >
                                    {/* ✅ IMAGE FIX */}
                                    <img
                                        src={
                                            car.image ||
                                            car.path ||
                                            "https://via.placeholder.com/300"
                                        }
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://via.placeholder.com/300";
                                        }}
                                        className="h-40 w-full object-cover"
                                    />

                                    <div className="p-4 space-y-2">
                                        <h2 className="font-bold">
                                            {car.name}
                                        </h2>

                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            {car.brand}
                                        </p>

                                        <p className="font-bold text-[#404258] dark:text-gray-300">
                                            Rp{" "}
                                            {Number(
                                                car.price ??
                                                car.price_per_day ??
                                                0
                                            ).toLocaleString()}
                                        </p>

                                        {/* STATUS */}
                                        <span
                                            className={`
                                                text-xs px-3 py-1 rounded
                                                ${status === "available" && "bg-green-200 text-green-600"}
                                                ${status === "maintenance" && "bg-yellow-200 text-yellow-600"}
                                                ${status === "outgarage" && "bg-red-200 text-red-600"}
                                            `}
                                        >
                                            {status}
                                        </span>

                                        <button
                                            onClick={() => handleRead(car)}
                                            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                                        >
                                            Read
                                        </button>

                                        <button
                                            onClick={() => handleBooking(car)}
                                            className="w-full bg-[#404258] hover:bg-[#2f3147] text-white py-2 rounded"
                                        >
                                            Booking
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
}

export default Home;