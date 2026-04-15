import { useEffect, useState } from "react";
import { getAllUsers } from "@/service/UserService";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

// 🔥 TYPE USER
type User = {
    id: number;
    name: string;
    created_at?: string;
};

type ChartData = {
    date: string;
    count: number;
};

function OverView() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        todayRegister: 0,
    });

    // 🔥 STATE DARK MODE
    const [isDark, setIsDark] = useState(false);

    // 🔥 DETEKSI DARK MODE + AUTO UPDATE
    useEffect(() => {
        const checkDark = () => {
            setIsDark(
                document.documentElement.classList.contains("dark")
            );
        };

        checkDark();

        const observer = new MutationObserver(checkDark);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // 🔥 AMBIL DATA USER
    useEffect(() => {
        getAllUsers()
            .then((res) => {
                const userList: User[] = res.data.data || [];

                setUsers(userList);

                const today = new Date().toISOString().slice(0, 10);

                const todayRegister = userList.filter(
                    (u: User) =>
                        u.created_at?.slice(0, 10) === today
                ).length;

                setStats({
                    total: userList.length,
                    todayRegister,
                });
            })
            .catch((err) => {
                console.error("Error ambil user:", err);
            });
    }, []);

    // 🔥 DATA CHART (REGISTER PER HARI)
    const chartData: ChartData[] = users.reduce(
        (acc: ChartData[], user: User) => {
            if (!user.created_at) return acc;

            const date = user.created_at.slice(0, 10);

            const existing = acc.find(
                (d: ChartData) => d.date === date
            );

            if (existing) {
                existing.count += 1;
            } else {
                acc.push({ date, count: 1 });
            }

            return acc;
        },
        []
    );

    // 🔥 THEME CONFIG
    const theme = {
        text: isDark ? "#e5e7eb" : "#374151",
        grid: isDark ? "#555" : "#e5e7eb",
        line: isDark ? "#00ADB5" : "#3b82f6",
        tooltipBg: isDark ? "#222" : "#fff",
        tooltipText: isDark ? "#fff" : "#000",
    };

    return (
        <div className="p-4 space-y-4">

            {/* 🔥 CARD */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-[#393E46] text-gray-800 dark:text-gray-200 rounded-xl shadow">
                    <h3>Total User</h3>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>

                <div className="p-4 bg-white dark:bg-[#393E46] text-gray-800 dark:text-gray-200 rounded-xl shadow">
                    <h3>Register Hari Ini</h3>
                    <p className="text-2xl font-bold">{stats.todayRegister}</p>
                </div>
            </div>

            {/* 🔥 CHART */}
            <div className="bg-white dark:bg-[#393E46] p-4 rounded-xl shadow">
                <h2 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">
                    Grafik Register User
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.grid}
                        />

                        <XAxis
                            dataKey="date"
                            stroke={theme.text}
                        />

                        <YAxis stroke={theme.text} />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.tooltipBg,
                                border: "none",
                                borderRadius: "8px",
                                color: theme.tooltipText,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke={theme.line}
                            strokeWidth={3}
                            dot={{
                                fill: theme.line,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default OverView;