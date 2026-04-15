import { useState, useEffect } from "react";

const CompleteUserModal = ({ isOpen, user, onClose, onSubmit }: any) => {
    const [form, setForm] = useState<any>({
        phone: "",
        address: "",
        city: "",
        country: "",
        document_number: "",
        document_type: "ktp",
    });

    const [status, setStatus] = useState("notcomplete");

    useEffect(() => {
        if (user) {
            const data = {
                phone: user.profile?.phone || "",
                address: user.profile?.address || "",
                city: user.profile?.city || "",
                country: user.profile?.country || "",
                document_number: user.profile?.document_number || "",
                document_type: user.profile?.document_type || "ktp",
            };

            setForm(data);
            checkStatus(data);
        }
    }, [user]);

    const handleChange = (e: any) => {
        const newForm = { ...form, [e.target.name]: e.target.value };
        setForm(newForm);
        checkStatus(newForm);
    };

    const checkStatus = (data: any) => {
        const isComplete =
            data.phone &&
            data.address &&
            data.city &&
            data.country &&
            data.document_number &&
            data.document_type;

        setStatus(isComplete ? "complete" : "notcomplete");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
            <div
                className="
                    w-full max-w-lg
                    rounded-2xl
                    bg-white/80 dark:bg-[#393E46]/90
                    backdrop-blur-xl
                    border border-white/30 dark:border-white/10
                    shadow-xl
                    p-6
                "
            >
                {/* HEADER */}
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    Complete Profile
                </h2>

                {/* FORM */}
                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input" />
                        <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input" />
                        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="input" />
                        <input name="document_number" placeholder="Document Number" value={form.document_number} onChange={handleChange} className="input" />
                    </div>

                    <input
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        className="input"
                    />

                    <select
                        name="document_type"
                        value={form.document_type}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="ktp">KTP</option>
                        <option value="sim">SIM</option>
                        <option value="dll">DLL</option>
                    </select>

                    {/* STATUS */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-300">
                            Status:
                        </span>

                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${status === "complete"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                                }`}
                        >
                            {status === "complete"
                                ? "Complete"
                                : "Not Complete"}
                        </span>
                    </div>
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 hover:opacity-80 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            onSubmit({
                                ...form,
                                status,
                            })
                        }
                        className="px-4 py-2 rounded-xl bg-[#404258] text-white hover:opacity-90 transition shadow"
                    >
                        Save
                    </button>
                </div>
            </div>

            <style>{`
                .input {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.75rem;
                    border: 1px solid rgba(0,0,0,0.1);
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(6px);
                }
                .input:focus {
                    outline: none;
                    border-color: #404258;
                }
                .dark .input {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default CompleteUserModal;