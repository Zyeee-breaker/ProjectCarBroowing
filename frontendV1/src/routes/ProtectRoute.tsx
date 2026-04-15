import { Navigate } from "react-router-dom";

interface Props {
    children: any;
    role?: string; // optional role
}

const ProtectedRoute = ({ children, role }: Props) => {
    const token = localStorage.getItem("access_token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // ❌ belum login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // ❌ role tidak sesuai
    if (role && user?.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;