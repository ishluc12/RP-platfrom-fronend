import api from '../api';

const notificationService = {
    getUserNotifications: async () => {
        const response = await api.get('/shared/notifications');
        return response.data;
    },
    markNotificationAsRead: async (id) => {
        const response = await api.put(`/shared/notifications/${id}/read`);
        return response.data;
    },
    markAllNotificationsAsRead: async () => {
        const response = await api.put('/shared/notifications/mark-all-read');
        return response.data;
    },
};

export default notificationService;
