import { useEffect, useState, useMemo } from "react";
import UserModal from "@/components/UserModal";
import CompleteUserModal from "@/components/CompleteUserModal";
import Swal from "sweetalert2";
import {
    FaTrash,
    FaEdit,
    FaEye,
    FaUserSecret,
    FaSearch,
    FaAngleLeft,
    FaAngleRight,
    FaUserPlus,
} from "react-icons/fa";
import { FaAnglesRight, } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

import {
    getAllUsers,
    createUser,
    AdmindeleteUser,
    AdminupdateUser,
    completeProfile,
} from "@/service/UserService";
import api from "@/service/ApiService";
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile?: any;
    images?: any[];
}
function AdminUsers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [modalType, setModalType] = useState<any>(null);
    const perPage = 10;
    const currentPage = Number(searchParams.get("page")) || 1;
    const setCurrentPage = (page: number) => {
        setSearchParams({ page: String(page) });
    };
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data.data);
        } finally {
            setLoading(false);
        }
    };
    const openModal = (type: any, user: any = null) => {
        setModalType(type);
        setSelectedUser(user);
    };
    // ================= HANDLE SUBMIT =================
    const handleSubmit = async (data?: any) => {
        try {
            let userId: number | null = null;
            const payloadUser = {
                name: data.name,
                email: data.email,
                role: data.role,
                ...(data.password && { password: data.password }),
            };
            if (modalType === "create") {
                const res = await createUser(payloadUser);
                userId = res.data.data.id;
            }
            if (modalType === "edit") {
                await AdminupdateUser(selectedUser.id, payloadUser);
                userId = selectedUser.id;
            }
            const payloadProfile = {
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country,
                document_number: data.document_number,
                document_type: data.document_type,
            };
            if (userId) {
                await completeProfile(userId, payloadProfile);
            }
            // ================= IMAGE =================
            if (userId && data.images?.length) {
                for (const img of data.images) {
                    // hanya upload file baru
                    if (img.file instanceof File) {
                        const formData = new FormData();
                        formData.append("path", img.file, img.file.name);
                        formData.append("user_id", String(userId));
                        formData.append("type", img.type || "profile");

                        await api.post("/images", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                    }
                }
            }
            if (modalType === "completeProfile") {
                await completeProfile(selectedUser.id, payloadProfile);
            }
            setModalType(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };
    // ================= DELETE =================
    const handleDelete = async (user: any) => {
        const result = await Swal.fire({
            title: "Hapus user?",
            text: user.name,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya",
        });

        if (result.isConfirmed) {
            await AdmindeleteUser(user.id);
            fetchUsers();
        }
    };
    const filteredUsers = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        const match = keyword.match(/^user\s+id(?:\s+(\d+))?$/);

        const idValue = match?.[1] ? Number(match[1]) : null;
        const isUserIdMode = match !== null;

        return users.filter((u) => {
            // MODE: user id (tanpa angka)
            if (isUserIdMode && idValue === null) {
                return true; // tampilkan semua user
            }

            // MODE: user id 12
            if (idValue !== null) {
                return u.id === idValue;
            }

            // NORMAL SEARCH
            return (
                u.name.toLowerCase().includes(keyword) ||
                u.email.toLowerCase().includes(keyword)
            );
        });
    }, [users, search]);
    const totalPages = Math.ceil(filteredUsers.length / perPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );
    return (
        <div className="p-4 dark:text-white">
            <div className="flex justify-between mb-4">
                <h1 className="flex items-center gap-2 text-xl font-bold">
                    <FaUserSecret /> Users
                </h1>
                <button
                    onClick={() => openModal("create")}
                    className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-xl"
                >
                    <FaUserPlus className="text-2xl pr-2" /> Add
                </button>
            </div>
            <div className="flex w-64 items-center gap-2 mb-4">
                <FaSearch />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari user..."
                    className="
                        w-full
                        bg-transparent
                        outline-none
                        text-sm
                        placeholder-gray-400
                        dark:placeholder-gray-500
                        border-b
                    "
                />
            </div>
            <table className="w-full text-sm border rounded-xl overflow-hidden shadow-lg shadow-gray-500/50">
                <thead className="bg-[#E8F9FF] dark:bg-[#2c2f36]">
                    <tr className="text-center">
                        <th>No.</th>
                        <th>Profile</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => {

                        const profileImg = user.profile_img?.find(
                            (i: any) => (i.type || "").toLowerCase() === "profile"
                        );

                        const cleanPath = profileImg?.path?.replace(/\\/g, "/");

                        return (
                            <tr key={user.id} className="border-b border-gray-500 dark:border-white">
                                <td className="p-3">
                                    {(currentPage - 1) * perPage + index + 1}
                                </td>
                                <td className="py-1">
                                    <img
                                        src={
                                            cleanPath
                                                ? `http://127.0.0.1:8000/storage/${cleanPath}`
                                                : "https://via.placeholder.com/40"
                                        }
                                        className="w-10 h-10 object-cover rounded-full shadow-lg flex justify-center items-center"
                                    />
                                </td>
                                <td className="p-3">
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-xs text-gray-500">User ID: {user.id}</p>
                                    </div>
                                </td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">
                                    <span className={`
                                        px-2 py-1 text-xs rounded-full
                                        ${user.role === "admin"
                                            ? "bg-red-100 text-red-600"
                                            : user.role === "staff"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-600"}
                                        `}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`
                                                px-3 py-1 text-xs font-medium rounded-full
                                                ${user.profile?.status === "complete"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                            }
                                            `}
                                    >
                                        {user.profile?.status === "complete" ? "Complete" : "Not complete"}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openModal("view", user)}>
                                            <FaEye />
                                        </button>
                                        <button onClick={() => openModal("edit", user)}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(user)}>
                                            <FaTrash />
                                        </button>
                                        <button onClick={() => openModal("completeProfile", user)}>
                                            <FaAnglesRight />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-6 text-sm">
                <div className="text-gray-600">
                    <span>
                        Showing{" "}
                        <b>
                            {(currentPage - 1) * perPage + 1}
                        </b>{" "}
                        to{" "}
                        <b>
                            {Math.min(currentPage * perPage, filteredUsers.length)}
                        </b>{" "}
                        of{" "}
                        <b>{filteredUsers.length}</b> users
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        <FaAngleLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
            <UserModal
                isOpen={["create", "edit", "view"].includes(modalType)}
                type={modalType}
                user={selectedUser}
                onClose={() => setModalType(null)}
                onSubmit={handleSubmit}
            />

            <CompleteUserModal
                isOpen={modalType === "completeProfile"}
                user={selectedUser}
                onClose={() => setModalType(null)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminUsers;