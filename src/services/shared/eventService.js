import api from '../api';

const eventService = {
    createEvent: async (eventData) => {
        const response = await api.post('/shared/events', eventData);
        return response.data;
    },
    getAllEvents: async (params) => {
        const response = await api.get('/shared/events', { params });
        return response.data;
    },
    getEventById: async (id) => {
        const response = await api.get(`/shared/events/${id}`);
        return response.data;
    },
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/shared/events/${id}`, eventData);
        return response.data;
    },
    deleteEvent: async (id) => {
        const response = await api.delete(`/shared/events/${id}`);
        return response.data;
    },
    rsvpToEvent: async (eventId) => {
        const response = await api.post(`/shared/events/${eventId}/rsvp`);
        return response.data;
    },
    removeRsvp: async (eventId) => {
        const response = await api.delete(`/shared/events/${eventId}/rsvp`);
        return response.data;
    },
    getEventParticipants: async (eventId) => {
        const response = await api.get(`/shared/events/${eventId}/participants`);
        return response.data;
    },
    getUserRsvpStatus: async (eventId) => {
        const response = await api.get(`/shared/events/${eventId}/rsvp-status`);
        return response.data;
    },
    getUserRsvpEvents: async () => {
        const response = await api.get('/shared/events/user-rsvps');
        return response.data;
    },
};

export default eventService;
