import api from '../api';

const lecturerAvailabilityService = {
    getLecturerAvailability: async () => {
        const response = await api.get('/lecturer/availability');
        return response.data;
    },
    setLecturerAvailability: async (availabilityData) => {
        const response = await api.post('/lecturer/availability', availabilityData);
        return response.data;
    },
    updateAvailability: async (id, availabilityData) => {
        const response = await api.put(`/lecturer/availability/${id}`, availabilityData);
        return response.data;
    },
    deleteAvailability: async (id) => {
        const response = await api.delete(`/lecturer/availability/${id}`);
        return response.data;
    },
};

export default lecturerAvailabilityService;
