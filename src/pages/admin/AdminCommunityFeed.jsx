import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import postService from '../../services/shared/postService';
import { FaSearch, FaTrash } from 'react-icons/fa';

const AdminCommunityFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date', 'likes', 'comments'
    const [filterCategory, setFilterCategory] = useState('All');

    // Dummy categories - replace with actual fetched categories
    const categories = ['All', 'Announcements', 'Questions', 'Discussions', 'Events'];

    useEffect(() => {
        fetchPosts();
    }, [searchQuery, sortBy, filterCategory]);

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await postService.getFeed(); // Assuming getFeed can be used by admin and has filter/sort capabilities
            let filteredPosts = response.data || response;

            if (filterCategory !== 'All') {
                filteredPosts = filteredPosts.filter(post => post.category === filterCategory);
            }

            if (searchQuery) {
                filteredPosts = filteredPosts.filter(post =>
                    post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.author?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (sortBy === 'date') {
                filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortBy === 'likes') {
                filteredPosts.sort((a, b) => b.likes - a.likes);
            } else if (sortBy === 'comments') {
                filteredPosts.sort((a, b) => b.comments - a.comments);
            }

            setPosts(filteredPosts);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError('Failed to load community feed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await postService.deletePost(id); // Assuming deletePost exists in shared service
            fetchPosts(); // Refresh list
        } catch (err) {
            console.error("Error deleting post:", err);
            // Display error to user
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Community Feed Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Community Feed Management</h1>
                    <p className="text-gray-600 mb-6">Manage and moderate community posts.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="relative w-full mb-4">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaSearch className="h-4 w-4 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search posts by content or user"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                className="form-select rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="likes">Sort by Likes</option>
                                <option value="comments">Sort by Comments</option>
                            </select>
                            <select
                                className="form-select rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading posts...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : posts.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Content</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {posts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{post.content}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.author}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-red-600 hover:text-red-900" onClick={() => handleDeletePost(post.id)}><FaTrash /> Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No community posts found.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminCommunityFeed;
