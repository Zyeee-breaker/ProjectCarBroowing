import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
    getCars,
    createCar,
    deleteCar,
} from "@/service/CarService";
import api from "@/service/ApiService";

import {
    FaTrash,
    FaPlus,
    FaExclamationTriangle,
    FaAngleLeft,
    FaAngleRight,
    FaSearch,
    FaTimes,
    FaEdit,
    FaEye,
    FaSync,
} from "react-icons/fa";

import { useSearchParams } from "react-router-dom";
import { getChildAllCategories } from "@/service/CategoryService";
import IconsCars from "@/assets/IconsCars.png";


function AdminCars() {

    const [cars, setCars] = useState<any[]>([]);
    const [selectedCar, setSelectedCar] = useState<any>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "show" | "edit">("create");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [category, setCategory] = useState<string>("all");
    const [previewMain, setPreviewMain] = useState<string | null>(null);
    const [previewDetails, setPreviewDetails] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            if (previewMain) URL.revokeObjectURL(previewMain);
            previewDetails.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewMain, previewDetails]);

    const [form, setForm] = useState({
        name: "",
        brand: "",
        model: "",
        year: "",
        price_per_day: "",
        cat_id: "",
        units: [{ plate_number: "", status: "available" }],
        features: [{ feature: "", description: "" }],
        main_image: null as File | null,
        detail_images: [] as File[],
    });
    type Unit = {
        id?: number;
        plate_number: string;
        status: string;
    };

    type Feature = {
        id?: number;
        feature: string;
        description: string;
    };

    type Car = {
        id: number;
        name: string;
        brand: string;
        model: string;
        year: string;
        price_per_day: number;
        category?: { id: number };
        units: Unit[];
        features: Feature[];
        images?: any[];
    };

    const modeConfig = {
        create: {
            label: "Tambah Mobil",
            icon: <FaPlus className="text-gray-500" />
        },
        edit: {
            label: "Edit Mobil",
            icon: <FaEdit className="text-gray-500" />
        },
        show: {
            label: "Detail Mobil",
            icon: <FaEye className="text-gray-500 dark:text-gray-300" />
        }
    };
    const [search, setSearch] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const perPage = 6;

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getChildAllCategories();
            setCategories(res.data.data || res.data);
        };

        fetchCategories();
    }, []);
    const filteredCars = useMemo(() => {
        const keyword = search.toLowerCase();

        return cars.filter((c) => {
            const matchSearch =
                c.name.toLowerCase().includes(keyword) ||
                c.brand.toLowerCase().includes(keyword);

            const matchCategory =
                category === "all" ||
                String(c.category?.id) === category;

            return matchSearch && matchCategory;
        });
    }, [cars, search, category]);
    const setCurrentPage = (page: number) => {
        setSearchParams({ page: String(page) });
    };

    const getImageUrl = (path: string) => {
        if (!path || path.includes("C:\\")) return "/no-image.jpg";
        return `${import.meta.env.VITE_API_URL}/storage/${path}`;
    };

    const fetchCars = async () => {
        const res = await getCars();
        setCars(res.data.data || res.data);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    // ================= RESET FORM =================
    const resetForm = () => {
        setForm({
            name: "",
            brand: "",
            model: "",
            year: "",
            price_per_day: "",
            cat_id: "",
            units: [{ plate_number: "", status: "available" }],
            features: [{ feature: "", description: "" }],
            main_image: null,
            detail_images: [],
        });
    };
    const isCarChanged = () => {
        if (!selectedCar) return true;

        return (
            form.name !== selectedCar.name ||
            form.brand !== selectedCar.brand ||
            form.model !== selectedCar.model ||
            form.year !== selectedCar.year ||
            Number(form.price_per_day) !== Number(selectedCar.price_per_day)
        );
    };

    const totalPages = Math.ceil(filteredCars.length / perPage);

    const currentCars = filteredCars.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const diffUnits = () => {
        const oldUnits: Unit[] = selectedCar?.units || [];
        const newUnits: Unit[] = form.units || [];

        const toCreate = newUnits.filter(
            (u) => !oldUnits.some((o) => o.plate_number === u.plate_number)
        );

        const toDelete = oldUnits.filter(
            (o) => !newUnits.some((u) => u.plate_number === o.plate_number)
        );

        const toUpdate = newUnits.filter((u) => {
            const old = oldUnits.find((o) => o.plate_number === u.plate_number);
            return old && old.status !== u.status;
        });

        return { toCreate, toDelete, toUpdate };
    };
    const diffFeatures = () => {
        const oldF: Feature[] = selectedCar?.features || [];
        const newF: Feature[] = form.features || [];

        const toCreate = newF.filter(
            (f) => !oldF.some((o) => o.feature === f.feature)
        );

        const toDelete = oldF.filter(
            (o) => !newF.some((f) => f.feature === o.feature)
        );

        const toUpdate = newF.filter((f) => {
            const old = oldF.find((o) => o.feature === f.feature);
            return old && old.description !== f.description;
        });

        return { toCreate, toDelete, toUpdate };
    };
    const isCategoryChanged = () => {
        const oldCat = selectedCar?.category?.id ?? null;
        const newCat = form.cat_id ? Number(form.cat_id) : null;

        // ❌ kalau kosong → jangan dianggap berubah
        if (newCat === null) return false;

        return newCat !== oldCat;
    };
    // ================= HANDLE SAVE (CREATE & EDIT) =================
    const handleSave = async () => {
        try {
            setLoading(true);
            let carId = selectedCar?.id;

            let hasChange = false;

            // ================= CAR =================
            if (mode === "edit") {
                if (isCarChanged()) {
                    hasChange = true;

                    await api.put(`/cars/${carId}`, {
                        name: form.name,
                        brand: form.brand,
                        model: form.model,
                        year: form.year,
                        price_per_day: form.price_per_day,
                    });
                }
            } else {
                const res = await createCar({
                    name: form.name,
                    brand: form.brand,
                    model: form.model,
                    year: form.year,
                    price_per_day: form.price_per_day,
                });

                carId = res.data.data.id;
                hasChange = true;
            }

            // ================= CATEGORY =================
            if (mode === "edit" && isCategoryChanged()) {
                hasChange = true;

                await api.post("/cars-category", {
                    car_id: carId,
                    cat_id: Number(form.cat_id),
                });
            }

            // ================= UNITS =================
            const { toCreate, toDelete, toUpdate } = diffUnits();

            if (toCreate.length || toDelete.length || toUpdate.length) {
                hasChange = true;

                for (const u of toCreate) {
                    if (!u.plate_number) continue;

                    await api.post("/cars-unit", {
                        car_id: carId,
                        plate_number: u.plate_number,
                        status: u.status,
                    });
                }

                for (const u of toUpdate) {
                    const old = selectedCar.units.find(
                        (o: Unit) => o.plate_number === u.plate_number
                    );

                    if (!old) continue;

                    await api.put(`/cars-unit/${old.id}`, {
                        status: u.status,
                    });
                }

                for (const u of toDelete) {
                    if (!u.id) continue;
                    await api.delete(`/cars-unit/${u.id}`);
                }
            }

            // ================= FEATURES =================
            const fDiff = diffFeatures();

            if (fDiff.toCreate.length || fDiff.toDelete.length || fDiff.toUpdate.length) {
                hasChange = true;

                for (const f of fDiff.toCreate) {
                    if (!f.feature) continue;

                    await api.post("/cars-feature", {
                        car_id: carId,
                        feature: f.feature,
                        description: f.description,
                    });
                }

                for (const f of fDiff.toUpdate) {
                    const old = selectedCar.features.find(
                        (o: Feature) => o.feature === f.feature
                    );

                    if (!old) continue;

                    await api.put(`/cars-feature/${old.id}`, {
                        description: f.description,
                    });
                }

                for (const f of fDiff.toDelete) {
                    if (!f.id) continue;
                    await api.delete(`/cars-feature/${f.id}`);
                }
            }

            // ================= IMAGE =================
            if (form.main_image || form.detail_images.length > 0) {
                hasChange = true;

                if (form.main_image) {
                    const fd = new FormData();
                    fd.append("car_id", String(carId));
                    fd.append("path", form.main_image);
                    fd.append("type", "main");

                    await api.post("/cars-image", fd);
                }

                for (const img of form.detail_images) {
                    const fd = new FormData();
                    fd.append("car_id", String(carId));
                    fd.append("path", img);
                    fd.append("type", "detail");

                    await api.post("/cars-image", fd);
                }
            }

            // ================= FINAL CHECK =================
            if (!hasChange) {
                Swal.fire("Info", "Tidak ada perubahan sama sekali.", "info");
                return;
            }

            Swal.fire("Berhasil", "Data berhasil diperbarui!", "success");

            setModalOpen(false);
            resetForm();
            fetchCars();

        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", "Terjadi kesalahan", "error");
        } finally {
            setLoading(false);
        }
    };

    // ================= DELETE =================
    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: "Hapus mobil ini?",
            text: "Data yang dihapus tidak bisa dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
            try {
                await deleteCar(id);
                Swal.fire("Terhapus!", "Data mobil berhasil dihapus.", "success");
                fetchCars();
            } catch (err) {
                console.error(err);
                Swal.fire("Gagal", "Gagal menghapus data.", "error");
            }
        }
    };

    // ================= ADD / REMOVE UNIT =================
    const addUnit = () => {
        setForm({ ...form, units: [...form.units, { plate_number: "", status: "available" }] });
    };

    const removeUnit = (index: number) => {
        const units = form.units.filter((_, i) => i !== index);
        setForm({ ...form, units });
    };

    // ================= ADD / REMOVE FEATURE =================
    const addFeature = () => {
        setForm({ ...form, features: [...form.features, { feature: "", description: "" }] });
    };

    const removeFeature = (index: number) => {
        const features = form.features.filter((_, i) => i !== index);
        setForm({ ...form, features });
    };

    // ================= OPEN MODAL HELPERS =================
    const openCreate = () => {
        resetForm();
        setSelectedCar(null);
        setMode("create");
        setModalOpen(true);
    };

    const openShow = (car: any) => {
        setSelectedCar(car);
        setMode("show");
        setModalOpen(true);
    };

    const openEdit = (car: any) => {
        setSelectedCar(car);
        setMode("edit");
        setForm({
            name: car.name ?? "",
            brand: car.brand ?? "",
            model: car.model ?? "",
            year: car.year ?? "",
            price_per_day: car.price_per_day ?? "",
            cat_id: "",
            units: car.units?.length ? car.units : [{ plate_number: "", status: "available" }],
            features: car.features?.length ? car.features : [{ feature: "", description: "" }],
            main_image: null,
            detail_images: [],
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        resetForm();
        setSelectedCar(null);
    };

    // ================= RENDER =================
    return (
        <>
            <section className="p-2 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={IconsCars} className="w-20 h-20 object-contain dark:invert" />
                        <h2 className="text-2xl font-serif items-center">
                            Cars Manajement
                        </h2>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#404258] text-white shadow hover:opacity-90"
                    >
                        <FaPlus /> Tambah Mobil
                    </button>
                </div>
                <div className="w-64 h-auto flex items-center gap-2">
                    <FaSearch className="text-2xl" />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Cari nama / brand..."
                        className="bg-transparent border-b border-gray-900 dark:border-gray-100 focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-transparent border border-gray-200 dark:border-gray-500 rounded-lg px-2 py-1 focus:outline-none focus:ring-0 focus:border-transparent"
                    >
                        <option value="all" className="text-black">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-black">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                {currentCars.length === 0 ? (
                    <div className="text-center py-16">
                        <FaExclamationTriangle className="mx-auto text-2xl mb-2 opacity-50" />
                        <span className="flex justify-center items-center gap-2 text-gray-500/50 italic">
                            Cars Not Found. Reload Again <FaSync />
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentCars.map((car) => {
                            const mainImage = car.images?.find((i) => i.type === "main")?.path;
                            return (
                                <div key={car.id} className="
                                rounded-xl overflow-hidden border border-gray-600 backdrop-blur-md shadow-lg hover:shadow-xl transition-all
                                ">
                                    <img src={getImageUrl(mainImage)} alt={car.name} className="h-40 w-full object-cover" />
                                    <div className="p-2 space-y-1">
                                        <h3 className="font-serif">
                                            {car.name}
                                        </h3>
                                        <span className="text-sm">
                                            {car.brand} · {car.model} · {car.year}
                                        </span>
                                        <span className="text-green-500 font-medium mt-1">
                                            Rp {Number(car.price_per_day).toLocaleString("id-ID")} / Day
                                        </span>
                                        <div className="flex gap-2 mt-3 justify-end items-center">
                                            <button
                                                onClick={() => openShow(car)}
                                                className="flex items-center gap-1 text-sm px-2 py-1.5 rounded-lg shadow dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                            >
                                                <FaEye /> Show
                                            </button>
                                            <button
                                                onClick={() => openEdit(car)}
                                                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition">
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(car.id)}
                                                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ml-auto bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition"
                                            >
                                                <FaTrash /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="flex flex-col justify-center items-center gap-2 pt-4">
                        <div className="text-gray-600">
                            <span>
                                Showing{" "}
                                <b>
                                    {(currentPage - 1) * perPage + 1}
                                </b>{" "}
                                to{" "}
                                <b>
                                    {Math.min(currentPage * perPage, filteredCars.length)}
                                </b>{" "}
                                of{" "}
                                <b>{filteredCars.length}</b> users
                            </span>
                        </div>
                        <div>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                            >
                                <FaAngleLeft />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg border transition ${page === currentPage
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                            >
                                <FaAngleRight />
                            </button>
                        </div>
                    </div>
                )}
                {modalOpen && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 px-4 bg-black/40 backdrop-blur-sm">
                        <div className="w-[90vw] max-w-6xl h-[90vh] rounded-2xl bg-white dark:bg-[#2c2f36] border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
                            {/* HEADER */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{modeConfig[mode].icon}</span>
                                    <span className="text-lg font-semibold">
                                        {modeConfig[mode].label}
                                    </span>
                                </div>
                                <button onClick={closeModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            {/* CONTENT */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ================= LEFT ================= */}
                                <div className="flex flex-col gap-4">
                                    {/* MAIN IMAGE DROP */}
                                    <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition relative overflow-hidden">

                                        {previewMain ? (
                                            <img
                                                src={previewMain}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <p className="text-sm mb-2">Main Image</p>
                                                <p className="text-xs text-gray-400">Klik atau drag file ke sini</p>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            hidden
                                            disabled={mode === "show"}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                setForm({ ...form, main_image: file });
                                                setPreviewMain(URL.createObjectURL(file));
                                            }}
                                        />

                                        {previewMain && mode !== "show" && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPreviewMain(null);
                                                    setForm({ ...form, main_image: null });
                                                }}
                                                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </label>
                                    {/* DETAIL IMAGE DROP */}
                                    <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition">
                                        <p className="text-sm mb-2">Detail Images</p>
                                        <p className="text-xs text-gray-400">Multiple upload</p>

                                        <input
                                            type="file"
                                            multiple
                                            hidden
                                            disabled={mode === "show"}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);

                                                setForm({
                                                    ...form,
                                                    detail_images: files,
                                                });

                                                const previews = files.map((file) =>
                                                    URL.createObjectURL(file)
                                                );

                                                setPreviewDetails(previews);
                                            }}
                                        />
                                    </label>

                                    {/* PREVIEW GRID */}
                                    {previewDetails.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            {previewDetails.map((src, i) => (
                                                <div key={i} className="relative">
                                                    <img
                                                        src={src}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />

                                                    {mode !== "show" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPreview = previewDetails.filter((_, index) => index !== i);
                                                                const newFiles = form.detail_images.filter((_, index) => index !== i);

                                                                setPreviewDetails(newPreview);
                                                                setForm({ ...form, detail_images: newFiles });
                                                            }}
                                                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full"
                                                        >
                                                            <FaTimes size={10} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* ================= RIGHT ================= */}
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={form.name}
                                        disabled={mode === "show"}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="bg-transparent border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Brand"
                                        value={form.brand}
                                        disabled={mode === "show"}
                                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                        className="bg-transparent border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Model"
                                        value={form.model}
                                        disabled={mode === "show"}
                                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                                        className="bg-transparent border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Year"
                                        value={form.year}
                                        disabled={mode === "show"}
                                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                                        className="bg-transparent border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={form.price_per_day}
                                        disabled={mode === "show"}
                                        onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                                        className="bg-transparent border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                {/* ================= UNITS ================= */}
                                <div className="border rounded-xl p-4 h-fit">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">Units</span>
                                        {mode !== "show" && (
                                            <button onClick={addUnit} className="text-sm text-blue-500 flex gap-1">
                                                <FaPlus /> Add
                                            </button>
                                        )}
                                    </div>
                                    {form.units.map((unit, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Plate"
                                                value={unit.plate_number}
                                                disabled={mode === "show"}
                                                onChange={(e) => {
                                                    const newUnits = [...form.units];
                                                    newUnits[i].plate_number = e.target.value;
                                                    setForm({ ...form, units: newUnits });
                                                }}
                                                className="bg-transparent border p-2 rounded w-full"
                                            />

                                            <select
                                                value={unit.status}
                                                disabled={mode === "show"}
                                                onChange={(e) => {
                                                    const newUnits = [...form.units];
                                                    newUnits[i].status = e.target.value;
                                                    setForm({ ...form, units: newUnits });
                                                }}
                                                className="bg-transparent border p-2 rounded"
                                            >
                                                <option value="available">Available</option>
                                                <option value="rented">Rented</option>
                                            </select>

                                            {mode !== "show" && (
                                                <button onClick={() => removeUnit(i)}>
                                                    <FaTrash className="text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* ================= FEATURES ================= */}
                                <div className="border rounded-xl p-4 h-fit">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">Features</span>
                                        {mode !== "show" && (
                                            <button onClick={addFeature} className="text-sm text-blue-500 flex gap-1">
                                                <FaPlus /> Add
                                            </button>
                                        )}
                                    </div>
                                    {form.features.map((f, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Feature"
                                                value={f.feature}
                                                disabled={mode === "show"}
                                                onChange={(e) => {
                                                    const newF = [...form.features];
                                                    newF[i].feature = e.target.value;
                                                    setForm({ ...form, features: newF });
                                                }}
                                                className="bg-transparent border p-2 rounded w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={f.description}
                                                disabled={mode === "show"}
                                                onChange={(e) => {
                                                    const newF = [...form.features];
                                                    newF[i].description = e.target.value;
                                                    setForm({ ...form, features: newF });
                                                }}
                                                className="bg-transparent border p-2 rounded w-full"
                                            />
                                            {mode !== "show" && (
                                                <button onClick={() => removeFeature(i)}>
                                                    <FaTrash className="text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* FOOTER */}
                            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                {mode !== "show" && (
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                                    >
                                        Simpan
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default AdminCars