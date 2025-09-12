import api from '../api';

const lecturerDashboardService = {
    getDashboardSummary: async () => {
        const response = await api.get('/lecturer/dashboard/summary');
        return response.data;
    },
    getRecentAppointments: async () => {
        const response = await api.get('/lecturer/dashboard/recent-appointments');
        return response.data;
    },
    getRecentStudents: async () => {
        const response = await api.get('/lecturer/dashboard/recent-students');
        return response.data;
    },
};

export default lecturerDashboardService;
