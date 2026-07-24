import api from "./api";

export const getTenants = async () => {
    const response = await api.get("/tenants");
    return response.data;
};

export const getTenantDashboard = () => {
    return api.get("/tenants/dashboard");
};

export const createTenant = (tenantData) => {
    return api.post("/tenants", tenantData);
};

export const updateTenant = (id, tenantData) => {
    return api.put(`/tenants/${id}`, tenantData);
};

export const deleteTenant = (id) => {
    return api.delete(`/tenants/${id}`);
};

