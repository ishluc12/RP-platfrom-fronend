import { useEffect, useState } from 'react';
import Api from '../../services/api';

export default function LecturerDashboard({ user }) {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [studentEngagement, setStudentEngagement] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Fetch upcoming appointments for lecturer
                const appointmentsRes = await Api.lecturer.appointments.upcoming();
                setUpcomingAppointments(Array.isArray(appointmentsRes?.data) ? appointmentsRes.data : []);

                // Fetch recent announcements
                // Assuming an API endpoint for lecturer-specific announcements, or shared ones
                // For now, let's use a placeholder if no specific API for lecturer announcements
                // If Api.lecturer.announcements.list() exists, use it. Otherwise, mock or adapt.
                const announcementsRes = await Api.shared.posts.feed({ type: 'announcement', authorId: user.id }); // Assuming announcements are posts with a type and can be filtered by author
                setRecentAnnouncements(Array.isArray(announcementsRes?.data) ? announcementsRes.data : []);

                // Fetch student engagement summary (assuming a lecturer dashboard summary API)
                const engagementRes = await Api.lecturer.dashboard.summary();
                setStudentEngagement(engagementRes?.data || engagementRes);

            } catch (err) {
                console.error('Error fetching lecturer dashboard data:', err);
                setError(err?.data?.message || err.message || 'Failed to load lecturer dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading lecturer dashboard...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
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
                                {upcomingAppointments.map((appt) => (
                                    <tr key={appt.id || appt._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(appt.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appt.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{appt.student?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appt.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No upcoming appointments.</p>
                )}
            </div>

            {/* Recent Announcements */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Announcements</h3>
                {recentAnnouncements.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentAnnouncements.map((announcement, index) => (
                            <li key={announcement.id || announcement._id || index} className="py-3">
                                <p className="font-medium text-gray-900">{announcement.title}</p>
                                <p className="text-sm text-gray-700 mt-1">{announcement.content.substring(0, 150)}...</p>
                                <p className="text-xs text-gray-500 mt-2">Posted on {new Date(announcement.created_at).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No recent announcements.</p>
                )}
            </div>

            {/* Student Engagement */}
            {studentEngagement && (typeof studentEngagement === 'object' ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Engagement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                            <p className="font-medium text-gray-700">Active Students</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">{studentEngagement.activeStudents || '---'}</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                            <p className="font-medium text-gray-700">Group Participation</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{studentEngagement.groupParticipation || '---'}%</p>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                            <p className="font-medium text-gray-700">Assignment Submissions</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">{studentEngagement.assignmentSubmissions || '---'}%</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Engagement</h3>
                    <p className="text-gray-700">{studentEngagement}</p>
                </div>
            ))}

        </div>
    );
}
