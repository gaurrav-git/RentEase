import api from "./api";

export const getMyComplaints = async () => {
    const { data } = await api.get("/complaints/my-complaints");
    return data;
};

export const createComplaint = async (complaintData) => {
    const { data } = await api.post("/complaints", complaintData);
    return data;
};