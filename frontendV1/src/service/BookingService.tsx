import api from "./ApiService";

export const getBookings = () => api.get("/bookings");

export const getBooking = (id: number) =>
    api.get(`/bookings/${id}`);

export const createBooking = (data: any) =>
    api.post("/bookings", data);

export const updateBooking = (id: number, data: any) =>
    api.put(`/bookings/${id}`, data);

export const deleteBooking = (id: number) =>
    api.delete(`/bookings/${id}`);
export const getMyBooking = () =>
    api.get("/bookings/my-bookings");