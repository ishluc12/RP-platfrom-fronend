import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import notificationService from '../../services/shared/notificationService';
import { FaBell, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const LecturerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markingAsRead, setMarkingAsRead] = useState(false);
    const [markAllSuccess, setMarkAllSuccess] = useState(false);
    const [markAllError, setMarkAllError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await notificationService.getUserNotifications();
            setNotifications(response.data || response);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        setMarkingAsRead(true);
        try {
            await notificationService.markNotificationAsRead(id);
            setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
        } catch (err) {
            console.error("Error marking notification as read:", err);
        } finally {
            setMarkingAsRead(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        setMarkingAsRead(true);
        setMarkAllError(null);
        setMarkAllSuccess(false);
        try {
            await notificationService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            setMarkAllSuccess(true);
        } catch (err) {
            console.error("Error marking all notifications as read:", err);
            setMarkAllError('Failed to mark all as read.');
        } finally {
            setMarkingAsRead(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Notifications" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Notifications</h1>
                    <p className="text-gray-600 mb-6">Stay updated with the latest activities and announcements.</p>

                    {markAllSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> All notifications marked as read.</span>
                        </div>
                    )}
                    {markAllError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {markAllError}</span>
                        </div>
                    )}

                    <div className="flex justify-end mb-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleMarkAllAsRead}
                            disabled={markingAsRead}
                        >
                            {markingAsRead ? 'Marking...' : 'Mark All As Read'}
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        {loading ? (
                            <p>Loading notifications...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center">
                                        {notification.read ? (
                                            <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                        ) : (
                                            <FaBell className="h-5 w-5 text-blue-500 mr-3" />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-800">{notification.title}</p>
                                            <p className="text-sm text-gray-600">{notification.message}</p>
                                            <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            className="text-sm text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            disabled={markingAsRead}
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No notifications found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerNotifications;
