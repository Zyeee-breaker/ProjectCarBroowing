import React, { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    type: "create" | "edit" | "view" | "completeProfile" | null;
    user?: any;
    onClose: () => void;
    onSubmit: (data?: any) => void;
}

const UserModal: React.FC<Props> = ({
    isOpen,
    type,
    user,
    onClose,
    onSubmit,
}) => {
    const [form, setForm] = useState<any>({
        name: "",
        email: "",
        password: "",
        role: "customer",

        phone: "",
        address: "",
        city: "",
        country: "",
        document_number: "",
        document_type: "ktp",

        images: [],
    });

    // ================= INIT =================
    useEffect(() => {
        if (user) {
            const existingImages =
                user.images?.map((img: any) => ({
                    file: null,
                    type: img.type,
                    preview: img.path,
                    existing: true,
                    id: img.id,
                })) || [];

            setForm({
                name: user.name || "",
                email: user.email || "",
                password: "",
                role: user.role || "customer",

                phone: user.profile?.phone || "",
                address: user.profile?.address || "",
                city: user.profile?.city || "",
                country: user.profile?.country || "",
                document_number: user.profile?.document_number || "",
                document_type: user.profile?.document_type || "ktp",

                images: existingImages,
            });
        }
    }, [user]);

    // ================= HANDLER =================
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];

        const newImages = files.map((file) => ({
            file,
            type: "profile",
            preview: URL.createObjectURL(file),
            existing: false,
        }));

        setForm((prev: any) => ({
            ...prev,
            images: [...prev.images, ...newImages],
        }));
    };

    const removeImage = (index: number) => {
        setForm((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, i: number) => i !== index),
        }));
    };

    const changeImageType = (index: number, value: string) => {
        const updated = [...form.images];
        updated[index].type = value;
        setForm({ ...form, images: updated });
    };

    const handleSubmit = () => onSubmit(form);

    if (!isOpen || !type) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2">
            <div className="w-full max-w-3xl bg-white dark:bg-[#2c2f36] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-lg font-semibold capitalize text-gray-800 dark:text-white">
                        {type} User
                    </h1>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* ================= VIEW ================= */}
                {type === "view" && user && (
                    <div className="space-y-6">

                        {/* USER */}
                        <Section title="User Info">
                            <Info label="Name" value={user.name} />
                            <Info label="Email" value={user.email} />
                            <Info label="Role" value={user.role} />
                        </Section>

                        {/* PROFILE */}
                        <Section title="Profile">
                            <div className="grid grid-cols-2 gap-3">
                                <Info label="Phone" value={user.profile?.phone} />
                                <Info label="City" value={user.profile?.city} />
                                <Info label="Country" value={user.profile?.country} />
                                <Info label="Address" value={user.profile?.address} />
                                <Info label="Doc Type" value={user.profile?.document_type} />
                                <Info label="Doc Number" value={user.profile?.document_number} />
                            </div>
                        </Section>

                        {/* IMAGES */}
                        <Section title="Images">
                            <div className="grid grid-cols-3 gap-3">
                                {user.images?.map((img: any, i: number) => (
                                    <img
                                        key={i}
                                        src={img.path}
                                        className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                                        onClick={() => window.open(img.path)}
                                    />
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ================= FORM ================= */}
                {(type === "create" || type === "edit") && (
                    <div className="space-y-6">

                        {/* BASIC */}
                        <Section title="User Info">
                            <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
                            <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />

                            {type === "create" && (
                                <Input name="password" type="password" onChange={handleChange} placeholder="Password" />
                            )}

                            <Select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="mt-2 text-xs bg-[#1f2228]"
                            >
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="customer">Customer</option>
                            </Select>
                        </Section>

                        {/* PROFILE */}
                        <Section title="Profile">
                            <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
                            <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" />

                            <div className="grid grid-cols-2 gap-3">
                                <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                                <Input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
                            </div>

                            <Input name="document_number" value={form.document_number} onChange={handleChange} placeholder="Document Number" />

                            <Select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="mt-2 text-xs bg-[#1f2228]"
                            >
                                <option value="ktp">KTP</option>
                                <option value="sim">SIM</option>
                                <option value="passport">Passport</option>
                            </Select>
                        </Section>

                        {/* IMAGES */}
                        <Section title="Images">
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = Array.from(e.dataTransfer.files) as File[];

                                    const newImages = files.map((file) => ({
                                        file,
                                        type: "profile",
                                        preview: URL.createObjectURL(file),
                                        existing: false,
                                    }));

                                    setForm((prev: any) => ({
                                        ...prev,
                                        images: [...prev.images, ...newImages],
                                    }));
                                }}
                                className="
                                    w-full
                                    border-2 border-dashed
                                    border-gray-300 dark:border-white/10
                                    rounded-xl
                                    p-6
                                    text-center
                                    cursor-pointer
                                    transition
                                    hover:border-[#404258]
                                    hover:bg-gray-50
                                    dark:hover:bg-white/5
                                "
                                onClick={() => document.getElementById("fileInput")?.click()}
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Drag & drop images here
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    or click to upload
                                </p>

                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    onChange={handleImage}
                                    className="hidden"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-3">
                                {form.images.map((img: any, index: number) => (
                                    <div key={index} className="relative border rounded-xl p-2">

                                        <img
                                            src={img.preview}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />

                                        <select
                                            value={img.type}
                                            onChange={(e) => changeImageType(index, e.target.value)}
                                            className="
                                                w-full mt-2 text-xs
                                                px-2 py-1.5
                                                rounded-lg
                                                border
                                                border-gray-200
                                                dark:border-white/10
                                                bg-white
                                                dark:bg-[#1f2228]
                                                text-gray-700
                                                dark:text-gray-200
                                                focus:outline-none
                                                focus:ring-1
                                                focus:ring-[#404258]
                                                appearance-none
                                            "
                                        >
                                            <option value="profile">Profile</option>
                                            <option value="data">Identity</option>
                                        </select>

                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    </div>
                )}

                {/* ACTION */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 hover:opacity-80"
                    >
                        Cancel
                    </button>

                    {type !== "view" && (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-xl bg-[#404258] text-white hover:opacity-90 shadow"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserModal;

/* ================= UI HELPERS ================= */

const Section = ({ title, children }: any) => (
    <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {title}
        </h3>
        {children}
    </div>
);

const Input = (props: any) => (
    <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#404258]"
    />
);

const Select = ({ className = "", ...props }: any) => (
    <select
        {...props}
        className={`
            w-full px-3 py-2 rounded-xl border
            bg-white/70 dark:bg-white/5
            border-gray-200 dark:border-white/10
            text-gray-700 dark:text-gray-200
            focus:outline-none focus:ring-1 focus:ring-[#404258]
            ${className}
        `}
    />
);

const Info = ({ label, value }: any) => (
    <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="font-medium">{value || "-"}</p>
    </div>
);