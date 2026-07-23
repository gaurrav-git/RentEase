import api from "./api";

export const getMyPayments = async () => {
    const response = await api.get("/payments/my-payments");
    return response.data;
};