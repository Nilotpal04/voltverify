import api from "./axios";
export const documentsApi = {
    list: (params) => api.get("/documents", { params }),
    get: (id) => api.get(`/documents/${id}`),
    upload: (form) =>
        api.post("/documents", form, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, body) => api.put(`/documents/${id}`, body),
    verify: (id, body) => api.post(`/documents/${id}/verify`, body),
    reject: (id, body) => api.post(`/documents/${id}/reject`, body),
    audit: (id) => api.get(`/documents/${id}/audit`),

    // Fetches the raw file as a Blob so we can create an object URL for preview.
    // The Authorization header is injected automatically by the axios interceptor.
    file: (id) => api.get(`/documents/${id}/file`, { responseType: "blob" }),
};
