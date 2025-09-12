import api from '../api';

const lecturerAppointmentService = {
    listAppointments: async () => {
        const response = await api.get('/lecturer/appointments');
        return response.data;
    },
    getUpcomingAppointments: async () => {
        const response = await api.get('/lecturer/appointments/upcoming');
        return response.data;
    },
    updateAppointmentStatus: async (id, status) => {
        const response = await api.put(`/lecturer/appointments/${id}/status`, { status });
        return response.data;
    },
};

export default lecturerAppointmentService;
