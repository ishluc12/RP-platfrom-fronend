import api from '../api';

const studentAppointmentService = {
    createAppointment: async (appointmentData) => {
        const response = await api.post('/student/appointments', appointmentData);
        return response.data;
    },
    listAppointments: async () => {
        const response = await api.get('/student/appointments');
        return response.data;
    },
    getUpcomingAppointments: async () => {
        const response = await api.get('/student/appointments/upcoming');
        return response.data;
    },
    cancelAppointment: async (id) => {
        const response = await api.delete(`/student/appointments/${id}`);
        return response.data;
    },
};

export default studentAppointmentService;
