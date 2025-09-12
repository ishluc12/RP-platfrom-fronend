import api from '../api';

const messageService = {
    // Message operations
    sendMessage: async (messageData) => {
        const response = await api.post('/shared/messages', messageData);
        return response.data;
    },
    getConversationThread: async (otherId, params) => {
        const response = await api.get(`/shared/messages/thread/${otherId}`, { params });
        return response.data;
    },
    getGroupMessages: async (groupId) => {
        const response = await api.get(`/shared/messages/group/${groupId}`);
        return response.data;
    },
    getUserConversations: async () => {
        const response = await api.get('/shared/messages/conversations');
        return response.data;
    },
    getUserGroupChats: async () => {
        const response = await api.get('/shared/messages/groups');
        return response.data;
    },
};

export default messageService;
