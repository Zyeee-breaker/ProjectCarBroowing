import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function ReportStaff() {
    const [data, setData] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);

    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: "http://127.0.0.1:8000/api/v1",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const fetchData = async () => {
        try {
            const res = await api.get("/staff/report/bookings");
            setData(res.data.data);
        } catch (err) {
            Swal.fire("Error", "Gagal ambil report", "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const exportPDF = () => {
        window.open("http://127.0.0.1:8000/api/v1/report/bookings/pdf", "_blank");
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Report Staff</h1>

            <button
                onClick={exportPDF}
                className="bg-red-500 text-white px-3 py-2 rounded mb-3"
            >
                Export PDF
            </button>

            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th>ID</th>
                        <th>User</th>
                        <th>Mobil</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((b) => (
                        <tr key={b.id} className="border-t">
                            <td>{b.id}</td>
                            <td>{b.user?.name}</td>
                            <td>{b.car_name}</td>
                            <td>{b.status}</td>

                            <td>
                                <button
                                    onClick={() => setSelected(b)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Detail Log
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL LOG */}
            {/* MODAL LOG */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-5 w-[600px] rounded">

                        <h2 className="text-lg font-bold mb-3">
                            Booking Report Detail
                        </h2>

                        <div className="space-y-2 text-sm">

                            <p><b>Booking ID:</b> {selected.id}</p>
                            <p><b>User:</b> {selected.user?.name}</p>
                            <p><b>Mobil:</b> {selected.car_name}</p>
                            <p><b>Status:</b> {selected.status}</p>

                        </div>

                        <hr className="my-3" />

                        <h3 className="font-semibold mb-2">Booking Logs</h3>

                        <div className="max-h-[250px] overflow-auto space-y-2">

                            {selected.logs?.length > 0 ? (
                                selected.logs.map((log: any) => (
                                    <div
                                        key={log.id}
                                        className="border p-2 rounded text-sm"
                                    >
                                        <p><b>Status:</b> {log.status}</p>
                                        <p><b>Description:</b> {log.description}</p>
                                        <p><b>Time:</b> {log.created_at}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Tidak ada log</p>
                            )}

                        </div>

                        <button
                            onClick={() => setSelected(null)}
                            className="mt-3 bg-gray-400 px-3 py-1 rounded"
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportStaff;