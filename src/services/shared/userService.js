import api from '../api';

const userService = {
    searchUsers: async (params) => {
        const response = await api.get('/shared/users/search', { params });
        return response.data;
    },
    updateUserProfile: async (profileData) => {
        const response = await api.put('/shared/users/profile', profileData);
        return response.data;
    },
    getUsersByRole: async (role) => {
        const response = await api.get(`/shared/users/role/${role}`);
        return response.data;
    },
    getUsersByDepartment: async (department) => {
        const response = await api.get(`/shared/users/department/${department}`);
        return response.data;
    },
    getUserStats: async () => {
        const response = await api.get('/shared/users/stats/overview');
        return response.data;
    },
    getConnections: async () => {
        const response = await api.get('/shared/users/connections');
        return response.data;
    },
    updateStatus: async (statusData) => {
        const response = await api.put('/shared/users/status', statusData);
        return response.data;
    },
    getUserById: async (id) => {
        const response = await api.get(`/shared/users/${id}`);
        return response.data;
    },
    getUserActivity: async (id) => {
        const response = await api.get(`/shared/users/${id}/activity`);
        return response.data;
    },
    toggleFollow: async (targetUserId) => {
        const response = await api.post(`/shared/users/${targetUserId}/follow`);
        return response.data;
    },
};

export default userService;
