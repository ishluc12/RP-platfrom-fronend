import api from '../api';

const adminAnnouncementService = {
    getAllAnnouncements: async () => {
        const response = await api.get('/admin/announcements');
        return response.data;
    },
    createAnnouncement: async (announcementData) => {
        const response = await api.post('/admin/announcements', announcementData);
        return response.data;
    },
    updateAnnouncement: async (id, announcementData) => {
        const response = await api.put(`/admin/announcements/${id}`, announcementData);
        return response.data;
    },
    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/admin/announcements/${id}`);
        return response.data;
    },
};

export default adminAnnouncementService;
