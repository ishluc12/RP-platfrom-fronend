import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import notificationService from '../../services/shared/notificationService';
import { FaBell, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const LecturerAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all notifications and filter them for announcement-like items.
            const response = await notificationService.getUserNotifications();
            const allNotifications = response.data || response;
            // Assuming a notification type or keyword for announcements
            const filteredAnnouncements = allNotifications.filter(notif =>
                (notif.type === 'announcement' || notif.title.toLowerCase().includes('announcement') || notif.category === 'announcement')
            );
            setAnnouncements(filteredAnnouncements);
        } catch (err) {
            console.error("Error fetching announcements:", err);
            setError('Failed to load announcements.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markNotificationAsRead(id);
            setAnnouncements(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Announcements" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Announcements</h1>
                    <p className="text-gray-600 mb-6">View important announcements from the administration and other lecturers.</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6">
                        {loading ? (
                            <p>Loading announcements...</p>
                        ) : announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <div key={announcement.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center">
                                        {announcement.read ? (
                                            <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                        ) : (
                                            <FaBell className="h-5 w-5 text-blue-500 mr-3" />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-800">{announcement.title}</p>
                                            <p className="text-sm text-gray-600">{announcement.message || announcement.content}</p>
                                            <p className="text-xs text-gray-500">Posted: {new Date(announcement.timestamp || announcement.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {!announcement.read && (
                                        <button
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                            onClick={() => handleMarkAsRead(announcement.id)}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No announcements found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerAnnouncements;
