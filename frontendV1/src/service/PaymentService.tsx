import api from "./ApiService";

export const getPayments = () => api.get("/payments");

export const createPayment = (bookingId: number, data: any) => {
    console.log("PAYMENT HIT:", bookingId);

    return api.post(`/payments/${bookingId}/pay`, data);
};