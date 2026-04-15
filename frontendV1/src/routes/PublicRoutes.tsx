import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import FirstLayouts from "@/components/layouts/FristLayouts";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AdminUsers from "@/pages/dashboard/admin/users";
import OverView from "@/pages/dashboard/admin/OverView";
import AdminCategories from "@/pages/dashboard/admin/category";
import AdminCars from "@/pages/dashboard/admin/cars";
import AdminBooking from "@/pages/dashboard/admin/booking";
import Register from "@/pages/auth/register";
import BookingStaff from "@/pages/dashboard/Staff/Booking";
import Cars from "@/pages/Cars";
import CarsDetail from "@/pages/CarsDetail";
import Booking from "@/pages/Booking";
import History from "@/pages/history";
import OverViewStaff from "@/pages/dashboard/Staff/OverViewStaff";
import CarStaff from "@/pages/dashboard/Staff/CarStaff";
import ReportStaff from "@/pages/dashboard/Staff/reportStaff";
import DashboardUser from "@/pages/dashboard/Customer/dashboardUser";
import CustomerCars from "@/pages/dashboard/Customer/customerCars";
import CustomerBooking from "@/pages/dashboard/Customer/customerBooking";
import CustomerHistory from "@/pages/dashboard/Customer/customerHistory";

function PublicRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<OverView />} />
                <Route path="admin" element={<OverView />} />
                <Route path="adminUsers" element={<AdminUsers />} />
                <Route path="adminCategories" element={<AdminCategories />} />
                <Route path="adminCars" element={<AdminCars />} />
                <Route path="adminBooking" element={<AdminBooking />} />

                <Route path="bookingStaff" element={<BookingStaff />} />
                <Route path="staff" element={<OverViewStaff />} />
                <Route path="ReportStaff" element={<ReportStaff />} />
                <Route path="CarStaff" element={<CarStaff />} />

                <Route path="customer" element={<DashboardUser />} />
                <Route path="customerCars" element={<CustomerCars />} />
                <Route path="customerBooking" element={<CustomerBooking />} />
                <Route path="customerHistory" element={<CustomerHistory />} />
            </Route>
            <Route element={<FirstLayouts />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/carsDetail/:id" element={<CarsDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/history" element={<History />} />
            </Route>
        </Routes>
    );
}

export default PublicRoutes;