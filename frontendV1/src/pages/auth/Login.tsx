import { useState } from "react";
import Swal from "sweetalert2";
import { login } from "@/service/AuthService";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login({ email, password });

            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));

            Swal.fire({
                title: "Login Berhasil 🚀",
                text: "Selamat datang kembali!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/dashboard");
        } catch (error: any) {
            Swal.fire({
                title: "Login Gagal ❌",
                text: error.response?.data?.message || "Email atau password salah",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            {/* CARD */}
            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">

                {/* TITLE */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome Back 👋
                    </h2>
                    <p className="text-gray-900 text-sm mt-2">
                        Login untuk melanjutkan
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-900">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan email..."
                            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm text-gray-900">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password..."
                            className="w-full mt-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>

                </form>

                {/* FOOTER */}
                <div className="text-center mt-6 text-sm text-gray-900">
                    © 2026 Zyeee System
                </div>
            </div>
        </div>
    );
}

export default Login;