import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import lecturerDashboardService from '../../services/lecturer/lecturerDashboardService';
import notificationService from '../../services/shared/notificationService';

const LecturerHome = () => {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [dashboardSummary, setDashboardSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appointmentsResponse = await lecturerDashboardService.getRecentAppointments();
                setUpcomingAppointments(appointmentsResponse.data || appointmentsResponse);

                const announcementsResponse = await notificationService.getUserNotifications(); // Assuming announcements are part of notifications
                setRecentAnnouncements(announcementsResponse.data || announcementsResponse);

                const summaryResponse = await lecturerDashboardService.getDashboardSummary();
                setDashboardSummary(summaryResponse.data || summaryResponse);

            } catch (err) {
                console.error("Error fetching lecturer dashboard data:", err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header pageTitle="Dashboard" />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <p>Loading dashboard...</p>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header pageTitle="Dashboard" />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <p className="text-red-500">{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Dashboard" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard</h1>

                        {/* Upcoming Appointments */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Appointments</h2>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {upcomingAppointments.length > 0 ? (
                                        upcomingAppointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.studentName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.reason}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No upcoming appointments.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Recent Announcements */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Announcements</h2>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            {recentAnnouncements.length > 0 ? (
                                recentAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="border-b border-gray-200 last:border-b-0 py-3">
                                        <p className="font-medium text-gray-900">{announcement.title}</p>
                                        <p className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No recent announcements.</p>
                            )}
                        </div>

                        {/* Student Engagement */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Student Engagement</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Active Students</p>
                                <p className="text-3xl text-blue-600 mt-2">{dashboardSummary?.activeStudents || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Group Participation</p>
                                <p className="text-3xl text-green-600 mt-2">{dashboardSummary?.groupParticipation || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Assignment Submissions</p>
                                <p className="text-3xl text-purple-600 mt-2">{dashboardSummary?.assignmentSubmissions || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerHome;
