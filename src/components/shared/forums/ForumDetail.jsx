import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import forumService from '../../../services/shared/forumService';
import PostCard from '../../common/PostCard';
import CommentSection from '../../common/CommentSection';
import { FaPaperPlane } from 'react-icons/fa';

const ForumDetail = () => {
    const { forumId } = useParams();
    const [forum, setForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [submittingPost, setSubmittingPost] = useState(false);

    useEffect(() => {
        if (forumId) {
            fetchForumDetails();
        }
    }, [forumId]);

    const fetchForumDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const [forumResponse, postsResponse] = await Promise.all([
                forumService.getForumById(forumId),
                forumService.getForumPostsByForum(forumId),
            ]);
            setForum(forumResponse.data || forumResponse);
            setPosts(postsResponse.data || postsResponse);
        } catch (err) {
            console.error("Error fetching forum details:", err);
            setError('Failed to load forum details.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            setError('Post title and content are required.');
            return;
        }

        setSubmittingPost(true);
        try {
            const postData = {
                title: newPostTitle,
                content: newPostContent,
            };
            await forumService.createForumPost(forumId, postData);
            setNewPostTitle('');
            setNewPostContent('');
            fetchForumDetails(); // Refresh forum and posts
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err.message || 'Failed to create post.');
        } finally {
            setSubmittingPost(false);
        }
    };

    const handleLikePost = (postId) => {
        console.log(`Liking post ${postId}`);
        // Implement actual API call to like a post
    };

    const handleCommentClick = (postId) => {
        console.log(`Viewing comments for post ${postId}`);
        // This could navigate to a post detail page or open a comment modal
    };

    if (loading) return <p>Loading forum...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!forum) return <p>Forum not found.</p>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">{forum.name}</h1>
            <p className="text-gray-600 mb-6">{forum.description}</p>

            {/* Create New Post Section */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Post</h2>
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                        <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="post-title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            placeholder="Enter post title"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            id="post-content"
                            rows="3"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="What's on your mind?"
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submittingPost}
                        >
                            <FaPaperPlane className="inline-block mr-2" />
                            {submittingPost ? 'Posting...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Forum Posts Section */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts in this Forum</h2>
            {posts.length > 0 ? (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <PostCard post={post} onLike={handleLikePost} onCommentClick={handleCommentClick} />
                            <CommentSection postId={post.id} />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No posts in this forum yet. Be the first to create one!</p>
            )}
        </div>
    );
};

export default ForumDetail;
