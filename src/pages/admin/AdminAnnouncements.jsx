import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminAnnouncementService from '../../services/admin/adminAnnouncementService'; // Assuming a new admin announcement service
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
    const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
    const [newAnnouncementAudience, setNewAnnouncementAudience] = useState('all');
    const [newAnnouncementSchedule, setNewAnnouncementSchedule] = useState('');
    const [submittingAnnouncement, setSubmittingAnnouncement] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAnnouncements();
    }, [searchQuery]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        setError(null);
        try {
            // This service call needs to be created or adjusted in the backend
            const response = await adminAnnouncementService.getAllAnnouncements();
            setAnnouncements(response.data || response);
        } catch (err) {
            console.error("Error fetching announcements:", err);
            setError('Failed to load announcements.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) {
            setSubmitError('Title and content are required.');
            return;
        }

        setSubmittingAnnouncement(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const announcementData = {
                title: newAnnouncementTitle,
                content: newAnnouncementContent,
                audience: newAnnouncementAudience,
                scheduleDate: newAnnouncementSchedule || undefined, // Optional schedule date
            };
            await adminAnnouncementService.createAnnouncement(announcementData);
            setSubmitSuccess(true);
            setNewAnnouncementTitle('');
            setNewAnnouncementContent('');
            setNewAnnouncementAudience('all');
            setNewAnnouncementSchedule('');
            fetchAnnouncements(); // Refresh list
        } catch (err) {
            console.error("Error creating announcement:", err);
            setSubmitError(err.message || 'Failed to create announcement.');
        } finally {
            setSubmittingAnnouncement(false);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await adminAnnouncementService.deleteAnnouncement(id);
            fetchAnnouncements(); // Refresh list
        } catch (err) {
            console.error("Error deleting announcement:", err);
            // Display error to user
        }
    };

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Announcements" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Announcements</h1>
                    <p className="text-gray-600 mb-6">Manage platform-wide announcements.</p>

                    {submitSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Announcement created successfully.</span>
                        </div>
                    )}
                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {submitError}</span>
                        </div>
                    )}

                    {/* Create New Announcement Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Announcement</h2>
                        <form onSubmit={handleCreateAnnouncement}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="announcement-title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="announcement-title"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newAnnouncementTitle}
                                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="announcement-content">
                                    Content
                                </label>
                                <textarea
                                    id="announcement-content"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="4"
                                    value={newAnnouncementContent}
                                    onChange={(e) => setNewAnnouncementContent(e.target.value)}
                                    placeholder="Enter announcement content"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="announcement-audience">
                                    Target Audience
                                </label>
                                <select
                                    id="announcement-audience"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newAnnouncementAudience}
                                    onChange={(e) => setNewAnnouncementAudience(e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="students">Students</option>
                                    <option value="lecturers">Lecturers</option>
                                    <option value="admins">Admins</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="announcement-schedule">
                                    Schedule (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    id="announcement-schedule"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newAnnouncementSchedule}
                                    onChange={(e) => setNewAnnouncementSchedule(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submittingAnnouncement}
                                >
                                    {submittingAnnouncement ? 'Creating...' : 'Create Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Existing Announcements Section */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Announcements</h2>
                    <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
                        <div className="relative w-full mb-4">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaSearch className="h-4 w-4 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search announcement"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {loading ? (
                            <p>Loading announcements...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : filteredAnnouncements.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAnnouncements.map((announcement) => (
                                        <tr key={announcement.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{announcement.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.audience}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${announcement.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {announcement.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                                                <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteAnnouncement(announcement.id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No announcements found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAnnouncements;
