import api from '../api';

const postService = {
    createPost: async (postData) => {
        const response = await api.post('/shared/posts', postData);
        return response.data;
    },
    getFeed: async (params) => {
        const response = await api.get('/shared/posts', { params });
        return response.data;
    },
    getPostById: async (id) => {
        const response = await api.get(`/shared/posts/${id}`);
        return response.data;
    },
    updatePost: async (id, postData) => {
        const response = await api.put(`/shared/posts/${id}`, postData);
        return response.data;
    },
    deletePost: async (id) => {
        const response = await api.delete(`/shared/posts/${id}`);
        return response.data;
    },
    likePost: async (postId) => {
        const response = await api.post(`/shared/posts/${postId}/like`);
        return response.data;
    },
    unlikePost: async (postId) => {
        const response = await api.delete(`/shared/posts/${postId}/unlike`);
        return response.data;
    },
};

export default postService;
