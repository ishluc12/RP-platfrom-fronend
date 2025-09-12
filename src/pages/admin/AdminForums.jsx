import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminForumService from '../../services/admin/adminForumService';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminForums = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchForums();
    }, [searchQuery]);

    const fetchForums = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminForumService.getAllForums();
            // Filter client-side for now, assuming search is not implemented on backend getAllForums directly
            const filteredForums = (response.data || response).filter(forum =>
                forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                forum.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setForums(filteredForums);
        } catch (err) {
            console.error("Error fetching forums:", err);
            setError('Failed to load forums.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteForum = async (id) => {
        if (!window.confirm('Are you sure you want to delete this forum?')) return;
        try {
            await adminForumService.deleteForum(id);
            fetchForums(); // Refresh list
        } catch (err) {
            console.error("Error deleting forum:", err);
            // Display error to user
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Forum Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Forum Management</h1>
                    <p className="text-gray-600 mb-6">Manage discussion forums and their content.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="relative w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaSearch className="h-4 w-4 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search forums by title or description"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading forums...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : forums.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {forums.map((forum) => (
                                <div key={forum.id} className="bg-white rounded-lg shadow-md p-4">
                                    <h3 className="font-semibold text-lg text-gray-800">{forum.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{forum.description}</p>
                                    <div className="mt-4 flex justify-end">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteForum(forum.id)}><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No forums found.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminForums;
