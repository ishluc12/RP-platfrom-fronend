import api from '../api';

const lecturerEventService = {
    createEvent: async (eventData) => {
        const response = await api.post('/lecturer/events', eventData);
        return response.data;
    },
    getMyEvents: async () => {
        const response = await api.get('/lecturer/events/my-events');
        return response.data;
    },
    getUpcomingEvents: async () => {
        const response = await api.get('/lecturer/events/upcoming');
        return response.data;
    },
    getPastEvents: async () => {
        const response = await api.get('/lecturer/events/past');
        return response.data;
    },
    searchEvents: async (params) => {
        const response = await api.get('/lecturer/events/search', { params });
        return response.data;
    },
    getLecturerEventStats: async (id = '') => {
        const response = await api.get(`/lecturer/events/stats/${id}`);
        return response.data;
    },
    getEventById: async (id) => {
        const response = await api.get(`/lecturer/events/${id}`);
        return response.data;
    },
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/lecturer/events/${id}`, eventData);
        return response.data;
    },
    deleteEvent: async (id) => {
        const response = await api.delete(`/lecturer/events/${id}`);
        return response.data;
    },
    getEventParticipants: async (id) => {
        const response = await api.get(`/lecturer/events/${id}/participants`);
        return response.data;
    },
};

export default lecturerEventService;
