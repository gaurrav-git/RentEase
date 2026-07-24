import api from "./api";

export const getComplaints = async () => {
    const response = await api.get("/complaints");
    return response.data;
};

export const getMyComplaints = async () => {
    const { data } = await api.get("/complaints/my-complaints");
    return data;
};

export const createComplaint = async (complaintData) => {
    const { data } = await api.post("/complaints", complaintData);
    return data;
};

export const updateComplaintStatus = async (id, status) => {
    const response = await api.put(`/complaints/${id}`, { status });
    return response.data;
};
