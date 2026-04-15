import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

import {
    getMainAllCategories,
    createMainCategory,
    updateMainCategory,
    deleteMainCategory,

    getChildAllCategories,
    createChildCategory,
    updateChildCategory,
    deleteChildCategory,
} from "@/service/CategoryService";

import FormattedDate from "@/components/FormatedDate";
import { FaTrash, FaEdit, FaTags, FaList, FaExclamationTriangle } from "react-icons/fa";

interface MainCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface ChildCategory {
    id: number;
    name: string;
    main_category_id: number;
    created_at: string;
    updated_at: string;
}

type EditMode = "create" | "edit" | null;

function AdminCategories() {
    // ================= DATA =================
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);

    // ================= MODAL =================
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState<EditMode>(null);
    const [editId, setEditId] = useState<number | null>(null);

    // ================= FORM =================
    const [form, setForm] = useState({
        main_name: "",
        children: [] as { id?: number; name: string }[],
    });

    // ================= FETCH =================
    const fetchData = async () => {
        const [mainRes, childRes] = await Promise.all([
            getMainAllCategories(),
            getChildAllCategories(),
        ]);

        setMainCategories(mainRes.data.data ?? []);
        setChildCategories(childRes.data.data ?? []);
    };
    
    
    const didFetch = useRef(false);
    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        fetchData();
    }, []);

    // ================= OPEN CREATE =================
    const openCreate = () => {
        setForm({
            main_name: "",
            children: [],
        });

        setEditMode("create");
        setEditId(null);
        setModalOpen(true);
    };

    // ================= OPEN EDIT =================
    const openEditMain = (item: MainCategory) => {
        const children = childCategories
            .filter(c => c.main_category_id === item.id)
            .map(c => ({
                id: c.id,
                name: c.name,
            }));

        setForm({
            main_name: item.name,
            children,
        });

        setEditMode("edit");
        setEditId(item.id);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditMode(null);
        setEditId(null);
    };

    // ================= CHILD CONTROL =================
    const addChild = () => {
        setForm({
            ...form,
            children: [...form.children, { name: "" }],
        });
    };

    const updateChild = (index: number, value: string) => {
        const updated = [...form.children];
        updated[index].name = value;
        setForm({ ...form, children: updated });
    };

    const removeChild = async (index: number) => {
        const child = form.children[index];

        if (child.id) {
            await deleteChildCategory(child.id);
        }

        setForm({
            ...form,
            children: form.children.filter((_, i) => i !== index),
        });
    };

    // ================= SAVE =================
    const handleSave = async () => {
        try {
            if (editMode === "create") {
                const mainRes = await createMainCategory({
                    name: form.main_name,
                });

                const mainId = mainRes.data?.data?.id || mainRes.data?.id;

                for (const child of form.children) {
                    if (child.name.trim()) {
                        await createChildCategory({
                            name: child.name,
                            main_category_id: mainId,
                        });
                    }
                }

                Swal.fire("Success", "Category created", "success");
            }

            if (editMode === "edit" && editId) {
                await updateMainCategory(editId, {
                    name: form.main_name,
                });

                for (const child of form.children) {
                    if (child.id) {
                        await updateChildCategory(child.id, {
                            name: child.name,
                            main_category_id: editId,
                        });
                    } else {
                        await createChildCategory({
                            name: child.name,
                            main_category_id: editId,
                        });
                    }
                }

                Swal.fire("Success", "Category updated", "success");
            }

            closeModal();
            fetchData();

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    // ================= DELETE =================
    const handleDeleteMain = async (id: number) => {
        const res = await Swal.fire({
            title: "Delete main category?",
            icon: "warning",
            showCancelButton: true,
        });

        if (res.isConfirmed) {
            await deleteMainCategory(id);
            fetchData();
        }
    };

    // ================= UI =================
    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="flex items-center gap-4 text-xl font-semibold text-gray-800 dark:text-white">
                    <FaTags /> Category
                </h1>

                <button
                    onClick={openCreate}
                    className="px-4 py-2 rounded-xl bg-[#404258] text-white shadow hover:opacity-90"
                >
                    + Add Category
                </button>
            </div>

            {/* MAIN CARDS */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mainCategories.length === 0 ? (
                    <div className="
                            col-span-full
                            w-full h-[300px]
                            flex flex-col items-center justify-center
                            text-center gap-3
                            text-gray-500 dark:text-gray-400
                            italic
                        ">
                        <FaExclamationTriangle className="text-gray-500/50 text-2xl opacity-80" />

                        <p className="text-sm font-medium">
                            Data Not Found
                        </p>

                        <span className="text-xs opacity-70">
                            Tidak ada data yang tersedia
                        </span>
                    </div>
                ) : (
                    mainCategories.map((main) => {
                        const children = childCategories.filter(
                            c => c.main_category_id === main.id
                        );

                        return (
                            <div
                                key={main.id}
                                className="border border-gray-200 dark:border-white/10 
                           rounded-xl shadow-sm hover:shadow-md transition"
                            >

                                {/* MAIN */}
                                <div className="flex justify-between items-start bg-[#E8F9FF] dark:bg-[#393E46] rounded-lg px-2 py-1">

                                    <div>
                                        <h5 className="text-sm text-gray-500 dark:text-gray-400">
                                            Category
                                        </h5>

                                        <h3 className="font-serif pl-2 text-gray-900 dark:text-white">
                                            {main.name}
                                        </h3>

                                        <p className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                                            Create {FormattedDate(main.created_at)} - Update {FormattedDate(main.updated_at)}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditMain(main)}
                                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition"
                                        >
                                            <FaEdit className="text-gray-600 dark:text-gray-300" />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteMain(main.id)}
                                            className="p-1 rounded hover:bg-red-500/10 transition"
                                        >
                                            <FaTrash className="text-red-500" />
                                        </button>
                                    </div>

                                </div>

                                {/* CHILD */}
                                <div className="h-32 overflow-y-auto px-2 py-1">
                                    <table className="w-full mt-3 text-sm">
                                        <thead className="text-gray-500 dark:text-gray-400">
                                            <tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Created</th>
                                                <th>Updated</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {children.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="text-center text-gray-400 py-3"
                                                    >
                                                        No child category
                                                    </td>
                                                </tr>
                                            ) : (
                                                children.map((child, i) => (
                                                    <tr
                                                        key={child.id}
                                                        className="text-center border-t border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                                                    >
                                                        <td className="py-1">{i + 1}</td>
                                                        <td>{child.name}</td>
                                                        <td className="text-xs">
                                                            {FormattedDate(child.created_at)}
                                                        </td>
                                                        <td className="text-xs">
                                                            {FormattedDate(child.updated_at)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white dark:bg-[#2c2f36] text-gray-800 dark:text-white p-4 w-[420px] rounded-xl shadow-lg">

                        <h2 className="font-semibold mb-4">
                            {editMode === "create" ? "Create" : "Edit"}Category
                        </h2>

                        {/* MAIN */}
                        <input
                            className="w-full border border-gray-200 dark:border-white/10 
                                       bg-white dark:bg-white/5 
                                       text-gray-800 dark:text-white 
                                       px-3 py-2 rounded-lg mb-3 
                                       focus:outline-none focus:ring-1 focus:ring-[#404258]"
                            value={form.main_name}
                            onChange={(e) =>
                                setForm({ ...form, main_name: e.target.value })
                            }
                            placeholder="Main Category"
                        />

                        {/* CHILD */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium flex items-center gap-2"><FaList /> Children</p>

                            {form.children.map((child, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        className="border border-gray-200 dark:border-white/10 
                                                   bg-white dark:bg-white/5 
                                                   text-gray-800 dark:text-white 
                                                   px-3 py-2 rounded-lg w-full"
                                        value={child.name}
                                        onChange={(e) =>
                                            updateChild(i, e.target.value)
                                        }
                                    />

                                    <button
                                        onClick={() => removeChild(i)}
                                        className="text-red-500"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addChild}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                + Add Child
                            </button>
                        </div>

                        {/* ACTION */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={closeModal}
                                className="px-3 py-1 rounded bg-gray-200 dark:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-3 py-1 rounded bg-[#404258] text-white"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;