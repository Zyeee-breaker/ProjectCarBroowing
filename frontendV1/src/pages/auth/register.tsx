import { useState } from "react";
import Swal from "sweetalert2";
import { register } from "@/service/AuthService";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",

        profile: {
            phone: "",
            address: "",
            city: "",
            country: "",
            document_number: "",
            document_type: "",
        },
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProfileChange = (e: any) => {
        setForm({
            ...form,
            profile: {
                ...form.profile,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...form,
                password_confirmation: form.password,
                profile: form.profile,
            };

            await register(payload);

            Swal.fire("Success", "Register berhasil", "success");
            navigate("/login");

        } catch (err: any) {
            console.error(err);

            Swal.fire(
                "Error",
                err?.response?.data?.message || "Register gagal",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#222831]">
            <form
                onSubmit={handleSubmit}
                className="w-[500px] bg-white dark:bg-[#393E46] p-6 rounded-xl space-y-3"
            >
                <h1 className="text-xl font-bold">Register</h1>

                <input
                    name="name"
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    onChange={handleChange}
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    className="w-full p-2 border rounded"
                    onChange={handleProfileChange}
                />

                <input
                    name="address"
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                    onChange={handleProfileChange}
                />

                <input
                    name="city"
                    placeholder="City"
                    className="w-full p-2 border rounded"
                    onChange={handleProfileChange}
                />

                <input
                    name="country"
                    placeholder="Country"
                    className="w-full p-2 border rounded"
                    onChange={handleProfileChange}
                />

                <input
                    name="document_number"
                    placeholder="Document Number"
                    className="w-full p-2 border rounded"
                    onChange={handleProfileChange}
                />

                <select
                    name="document_type"
                    className="w-full p-2 border rounded"
                    onChange={handleProfileChange}
                >
                    <option value="">Select Document Type</option>
                    <option value="ktp">KTP</option>
                    <option value="sim">SIM</option>
                    <option value="dll">DLL</option>
                </select>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Register;