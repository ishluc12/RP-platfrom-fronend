import api from '../api';

const studentEventService = {
    getAllEvents: async () => {
        const response = await api.get('/student/events');
        return response.data;
    },
    getUpcomingEvents: async () => {
        const response = await api.get('/student/events/upcoming');
        return response.data;
    },
    getPastEvents: async () => {
        const response = await api.get('/student/events/past');
        return response.data;
    },
    searchEvents: async (params) => {
        const response = await api.get('/student/events/search', { params });
        return response.data;
    },
    getEventsByCreator: async (userId) => {
        const response = await api.get(`/student/events/creator/${userId}`);
        return response.data;
    },
    getEventsByDepartment: async (department) => {
        const response = await api.get(`/student/events/department/${department}`);
        return response.data;
    },
    getTodayEvents: async () => {
        const response = await api.get('/student/events/today');
        return response.data;
    },
    getThisWeekEvents: async () => {
        const response = await api.get('/student/events/this-week');
        return response.data;
    },
    getThisMonthEvents: async () => {
        const response = await api.get('/student/events/this-month');
        return response.data;
    },
    getEventById: async (id) => {
        const response = await api.get(`/student/events/${id}`);
        return response.data;
    },
    getEventsWithParticipantCounts: async () => {
        const response = await api.get('/student/events/with-participant-counts');
        return response.data;
    },
    rsvpToEvent: async (id) => {
        const response = await api.post(`/student/events/${id}/rsvp`);
        return response.data;
    },
    removeRsvp: async (id) => {
        const response = await api.delete(`/student/events/${id}/rsvp`);
        return response.data;
    },
    getEventParticipants: async (id) => {
        const response = await api.get(`/student/events/${id}/participants`);
        return response.data;
    },
    getUserRsvpStatus: async (id) => {
        const response = await api.get(`/student/events/${id}/rsvp-status`);
        return response.data;
    },
    getEventStats: async (id) => {
        const response = await api.get(`/student/events/${id}/stats`);
        return response.data;
    },
    getUserRsvpEvents: async () => {
        const response = await api.get('/student/events/rsvp/events');
        return response.data;
    },
};

export default studentEventService;
