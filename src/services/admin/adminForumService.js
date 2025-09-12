import api from '../api';

const adminForumService = {
    getAllForums: async () => {
        const response = await api.get('/admin/forums');
        return response.data;
    },
    getForumById: async (id) => {
        const response = await api.get(`/admin/forums/${id}`);
        return response.data;
    },
    updateForum: async (id, forumData) => {
        const response = await api.put(`/admin/forums/${id}`, forumData);
        return response.data;
    },
    deleteForum: async (id) => {
        const response = await api.delete(`/admin/forums/${id}`);
        return response.data;
    },
    getForumPostsByForum: async (forumId) => {
        const response = await api.get(`/admin/forums/${forumId}/posts`);
        return response.data;
    },
    getForumPostById: async (postId) => {
        const response = await api.get(`/admin/forums/posts/${postId}`);
        return response.data;
    },
    updateForumPost: async (postId, postData) => {
        const response = await api.put(`/admin/forums/posts/${postId}`, postData);
        return response.data;
    },
    deleteForumPost: async (postId) => {
        const response = await api.delete(`/admin/forums/posts/${postId}`);
        return response.data;
    },
};

export default adminForumService;
