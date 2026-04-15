import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getCars,
    getCarUnits,
    getCarImages,
} from "@/service/CarService";
import IconsCars from "@/assets/IconsCars.png";
import { FaSearch } from "react-icons/fa";
type Car = {
    id: number;
    name: string;
    brand: string;
    model?: string;
    year?: string;
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
function Cars() {
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [units, setUnits] = useState<CarUnit[]>([]);
    const [carImages, setCarImages] = useState<CarImage[]>([]);
    const [search, setSearch] = useState("");
    // ✅ FILTER STATE
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const carRes = await getCars();
            const unitRes = await getCarUnits();
            const imageRes = await getCarImages();
            setCars(carRes.data.data || carRes.data);
            setUnits(unitRes.data.data || unitRes.data);
            setCarImages(imageRes.data.data || imageRes.data);
        } catch (err) {
            console.error(err);
        }
    };
    // ✅ IMAGE FIX
    const getCarImage = (carId: number) => {
        const img = carImages.find((i) => i.car_id === carId);
        if (!img?.path) return "https://via.placeholder.com/300";
        if (img.path.startsWith("http")) return img.path;
        return BASE_IMAGE_URL + img.path;
    };
    const getCarStatus = (carId: number) => {
        const carUnits = units.filter((u) => u.car_id === carId);
        if (carUnits.some((u) => u.status === "available")) return "available";
        if (carUnits.some((u) => u.status === "maintenance")) return "maintenance";
        if (carUnits.some((u) => u.status === "outgarage")) return "outgarage";
        return "unknown";
    };
    // ✅ TOGGLE CHECKBOX
    const toggleCheckbox = (
        value: string,
        state: string[],
        setState: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (state.includes(value)) {
            setState(state.filter((v) => v !== value));
        } else {
            setState([...state, value]);
        }
    };
    // ✅ UNIQUE DATA
    const brands = [...new Set(cars.map((c) => c.brand).filter(Boolean))];
    const models = [...new Set(cars.map((c) => c.model).filter(Boolean))];
    const years = [...new Set(cars.map((c) => c.year).filter(Boolean))];
    // ✅ FILTER LOGIC
    const filteredCars = cars.filter((car) => {
        const matchSearch =
            car.name?.toLowerCase().includes(search.toLowerCase()) ||
            car.brand?.toLowerCase().includes(search.toLowerCase());
        const matchBrand =
            selectedBrands.length === 0 ||
            selectedBrands.includes(car.brand);
        const matchModel =
            selectedModels.length === 0 ||
            selectedModels.includes(car.model || "");
        const matchYear =
            selectedYears.length === 0 ||
            selectedYears.includes(car.year || "");
        return matchSearch && matchBrand && matchModel && matchYear;
    });
    const handleRead = (car: Car) => {
        navigate(`/carsDetail/${car.id}`);
    };
    const handleBooking = (car: Car) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            Swal.fire({
                title: "Harus Login!",
                text: "Login dulu 🚗",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Login",
                cancelButtonText: "Register",
                showCloseButton:true
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate("/register");
                }
            });
            return;
        }
        navigate(`/booking?car_id=${car.id}`);
    };

    return (
        <>
            {/* HEADER / SEARCH */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#222831] backdrop-blur border-b border-gray-500/50 px-6 py-4 flex items-center gap-4">
                <img src={IconsCars} className="w-10 h-10 object-contain dark:invert" />
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Cari mobil impianmu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-[#393E46] 
                    text-gray-800 dark:text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </span>
                </div>
            </div>
            <section className="flex h-screen bg-white dark:bg-[#222831] text-gray-900 dark:text-white overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-64 p-5 border-r border-gray-500/50 flex flex-col gap-6 bg-gray-50 dark:bg-[#393E46]">
                    {/* FILTER TITLE */}
                    <h2 className="font-bold text-lg">Filter</h2>
                    {/* BRAND */}
                    <div>
                        <h3 className="font-semibold mb-2 text-sm text-gray-500">Brand</h3>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {brands.map((b) => (
                                <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                                    <input
                                        type="checkbox"
                                        checked={selectedBrands.includes(b!)}
                                        onChange={() =>
                                            toggleCheckbox(b!, selectedBrands, setSelectedBrands)
                                        }
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            accentColor: "#2563eb",
                                            cursor: "pointer"
                                        }}
                                    />
                                    {b}
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* MODEL */}
                    <div>
                        <h3 className="font-semibold mb-2 text-sm text-gray-500">Model</h3>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {models.map((m) => (
                                <label key={m} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                                    <input
                                        type="checkbox"
                                        checked={selectedModels.includes(m!)}
                                        onChange={() =>
                                            toggleCheckbox(m!, selectedModels, setSelectedModels)
                                        }
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            accentColor: "#2563eb",
                                            cursor: "pointer"
                                        }}
                                    />
                                    {m}
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* YEAR */}
                    <div>
                        <h3 className="font-semibold mb-2 text-sm text-gray-500">Year</h3>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {years.map((y) => (
                                <label key={y} className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                                    <input
                                        type="checkbox"
                                        checked={selectedYears.includes(y!)}
                                        onChange={() =>
                                            toggleCheckbox(y!, selectedYears, setSelectedYears)
                                        }
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            accentColor: "#2563eb",
                                            cursor: "pointer"
                                        }}
                                    />
                                    {y}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>
                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto">
                    {/* HERO / INTRO */}
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-1">
                            Temukan Mobil Terbaik 🚗
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Pilih kendaraan sesuai kebutuhanmu dengan cepat dan mudah.
                        </p>
                    </div>
                    {/* GRID */}
                    <div className="px-6 pb-10 grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6">
                        {filteredCars.map((car) => {
                            const status = getCarStatus(car.id);
                            return (
                                <div
                                    key={car.id}
                                    className="bg-white dark:bg-[#393E46] rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={getCarImage(car.id)}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    "https://via.placeholder.com/300";
                                            }}
                                            className="h-40 w-full object-cover group-hover:scale-105 transition"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg">
                                            {car.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {car.brand} • {car.model} • {car.year}
                                        </p>
                                        {/* STATUS BADGE */}
                                        <div className="mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full 
                                            ${status === "available" ? "bg-green-100 text-green-600" : ""}
                                            ${status === "maintenance" ? "bg-yellow-100 text-yellow-600" : ""}
                                            ${status === "outgarage" ? "bg-red-100 text-red-600" : ""}
                                        `}>
                                                {status}
                                            </span>
                                        </div>
                                        {/* ACTION */}
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleRead(car)}
                                                className="flex-1 text-sm bg-gray-200 dark:bg-gray-600 py-2 rounded-lg hover:bg-gray-300 transition"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => handleBooking(car)}
                                                className="flex-1 text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Booking
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </section>
        </>
    );
}

export default Cars;