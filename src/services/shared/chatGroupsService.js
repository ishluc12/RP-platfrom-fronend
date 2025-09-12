import api from '../api';

const chatGroupService = {
    createChatGroup: async (groupData) => {
        const response = await api.post('/shared/chatGroups', groupData);
        return response.data;
    },
    getChatGroupById: async (id) => {
        const response = await api.get(`/shared/chatGroups/${id}`);
        return response.data;
    },
    updateChatGroup: async (id, groupData) => {
        const response = await api.put(`/shared/chatGroups/${id}`, groupData);
        return response.data;
    },
    deleteChatGroup: async (id) => {
        const response = await api.delete(`/shared/chatGroups/${id}`);
        return response.data;
    },
    addGroupMember: async (groupId, userId) => {
        const response = await api.post(`/shared/chatGroups/${groupId}/members`, { userId });
        return response.data;
    },
    removeGroupMember: async (groupId, userId) => {
        const response = await api.delete(`/shared/chatGroups/${groupId}/members/${userId}`);
        return response.data;
    },
};

export default chatGroupService;
