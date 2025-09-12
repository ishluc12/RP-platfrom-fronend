import api from '../api';

const commentService = {
    createComment: async (postId, commentData) => {
        const response = await api.post(`/shared/comments/post/${postId}`, commentData);
        return response.data;
    },
    getCommentsByPost: async (postId) => {
        const response = await api.get(`/shared/comments/post/${postId}`);
        return response.data;
    },
    deleteComment: async (commentId) => {
        const response = await api.delete(`/shared/comments/${commentId}`);
        return response.data;
    },
};

export default commentService;
