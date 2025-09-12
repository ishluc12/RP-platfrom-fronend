import api from '../api';

const adminEventService = {
    getAllEvents: async () => {
        const response = await api.get('/admin/events');
        return response.data;
    },
    createEvent: async (eventData) => {
        const response = await api.post('/admin/events', eventData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getEventStats: async (id = '') => {
        const response = await api.get(`/admin/events/stats/${id}`);
        return response.data;
    },
    getEventsWithAdvancedFilters: async (params) => {
        const response = await api.get('/admin/events/advanced-filters', { params });
        return response.data;
    },
    getEventsByUser: async (userId) => {
        const response = await api.get(`/admin/events/user/${userId}`);
        return response.data;
    },
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/admin/events/${id}`, eventData);
        return response.data;
    },
    deleteEvent: async (id) => {
        const response = await api.delete(`/admin/events/${id}`);
        return response.data;
    },
    bulkDeleteEvents: async (eventIds) => {
        const response = await api.delete('/admin/events/bulk', { data: { eventIds } });
        return response.data;
    },
};

export default adminEventService;
