import api from '../api';

const forumService = {
    createForum: async (forumData) => {
        const response = await api.post('/shared/forums', forumData);
        return response.data;
    },
    getAllForums: async () => {
        const response = await api.get('/shared/forums');
        return response.data;
    },
    getForumById: async (id) => {
        const response = await api.get(`/shared/forums/${id}`);
        return response.data;
    },
    updateForum: async (id, forumData) => {
        const response = await api.put(`/shared/forums/${id}`, forumData);
        return response.data;
    },
    deleteForum: async (id) => {
        const response = await api.delete(`/shared/forums/${id}`);
        return response.data;
    },
    createForumPost: async (forumId, postData) => {
        const response = await api.post(`/shared/forums/${forumId}/posts`, postData);
        return response.data;
    },
    getForumPostsByForum: async (forumId) => {
        const response = await api.get(`/shared/forums/${forumId}/posts`);
        return response.data;
    },
    getForumPostById: async (postId) => {
        const response = await api.get(`/shared/forums/posts/${postId}`);
        return response.data;
    },
    updateForumPost: async (postId, postData) => {
        const response = await api.put(`/shared/forums/posts/${postId}`, postData);
        return response.data;
    },
    deleteForumPost: async (postId) => {
        const response = await api.delete(`/shared/forums/posts/${postId}`);
        return response.data;
    },
};

export default forumService;
