import api from '../api';

const adminUserService = {
    getAllUsers: async (params) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },
    getUserById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },
    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },
    bulkUpdateUsers: async (userData) => {
        const response = await api.put('/admin/users/bulk/update', userData);
        return response.data;
    },
    bulkDeleteUsers: async (userIds) => {
        const response = await api.delete('/admin/users/bulk/delete', { data: { userIds } });
        return response.data;
    },
    getUserAnalytics: async () => {
        const response = await api.get('/admin/users/analytics/overview');
        return response.data;
    },
    exportUsers: async () => {
        const response = await api.get('/admin/users/export/data');
        return response.data;
    },
    toggleUserStatus: async (id, statusData) => {
        const response = await api.put(`/admin/users/${id}/status`, statusData);
        return response.data;
    },
    getUserActivityLogs: async (id) => {
        const response = await api.get(`/admin/users/${id}/logs`);
        return response.data;
    },
};

export default adminUserService;
