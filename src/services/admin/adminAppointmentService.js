import api from '../api';

const adminAppointmentService = {
    getAllAppointments: async (params) => {
        const response = await api.get('/admin/appointments', { params });
        return response.data;
    },
    updateAppointment: async (id, appointmentData) => {
        const response = await api.put(`/admin/appointments/${id}`, appointmentData);
        return response.data;
    },
    deleteAppointment: async (id) => {
        const response = await api.delete(`/admin/appointments/${id}`);
        return response.data;
    },
};

export default adminAppointmentService;
