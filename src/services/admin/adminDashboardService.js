import api from '../api';

const adminDashboardService = {
    getDashboardSummary: async () => {
        const response = await api.get('/admin/dashboard/summary');
        return response.data;
    },
    getRecentActivity: async () => {
        const response = await api.get('/admin/dashboard/recent-activity');
        return response.data;
    },
    getTopCreators: async () => {
        const response = await api.get('/admin/dashboard/top-creators');
        return response.data;
    },
    getRecentRegistrations: async () => {
        const response = await api.get('/admin/dashboard/recent-registrations');
        return response.data;
    },
};

export default adminDashboardService;
