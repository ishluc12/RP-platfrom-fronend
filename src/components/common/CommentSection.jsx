import React, { useState, useEffect } from 'react';
import commentService from '../../../services/shared/commentService';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await commentService.getCommentsByPost(postId);
            setComments(response.data || response);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError('Failed to load comments.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        setSubmittingComment(true);
        try {
            const commentData = { text: newCommentText };
            const response = await commentService.createComment(postId, commentData);
            setComments(prevComments => [...prevComments, response.data || response]);
            setNewCommentText('');
        } catch (err) {
            console.error("Error adding comment:", err);
            setError('Failed to add comment.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await commentService.deleteComment(commentId);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError('Failed to delete comment.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Comments</h4>

            {loading ? (
                <p className="text-gray-600">Loading comments...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : comments.length > 0 ? (
                <div className="space-y-4 mb-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800 text-sm"><strong>{comment.author || 'Anonymous'}:</strong> {comment.text}</p>
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Delete comment"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 text-right">{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 mb-4">No comments yet. Be the first to comment!</p>
            )}

            <form onSubmit={handleAddComment} className="flex mt-4 space-x-3">
                <input
                    type="text"
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    disabled={submittingComment}
                />
                <button
                    type="submit"
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newCommentText.trim() || submittingComment}
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
