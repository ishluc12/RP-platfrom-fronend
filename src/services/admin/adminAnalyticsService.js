import api from '../api';

const adminAnalyticsService = {
    getOverallPlatformStats: async () => {
        const response = await api.get('/admin/analytics/platform-stats');
        return response.data;
    },
    getUserGrowthAnalytics: async () => {
        const response = await api.get('/admin/analytics/user-growth');
        return response.data;
    },
    getContentOverview: async () => {
        const response = await api.get('/admin/analytics/content-overview');
        return response.data;
    },
    getAppointmentMetrics: async () => {
        const response = await api.get('/admin/analytics/appointment-metrics');
        return response.data;
    },
};

export default adminAnalyticsService;
