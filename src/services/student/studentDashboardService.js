import api from '../api';

const studentDashboardService = {
    getDashboardSummary: async () => {
        const response = await api.get('/student/dashboard/summary');
        return response.data;
    },
    getUpcomingEvents: async () => {
        const response = await api.get('/student/dashboard/upcoming-events');
        return response.data;
    },
    getUpcomingAppointments: async () => {
        const response = await api.get('/student/dashboard/upcoming-appointments');
        return response.data;
    },
    getRecentPosts: async () => {
        const response = await api.get('/student/dashboard/recent-posts');
        return response.data;
    },
};

export default studentDashboardService;
