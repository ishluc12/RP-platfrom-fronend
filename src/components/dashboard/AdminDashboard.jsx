import { useEffect, useState } from 'react';
import Api from '../../services/api';

export default function AdminDashboard({ user }) {
    const [summary, setSummary] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Fetch admin dashboard summary
                const summaryRes = await Api.admin.dashboard.summary();
                setSummary(summaryRes?.data || summaryRes);

                // Fetch recent activity for admin
                const activityRes = await Api.admin.dashboard.recentActivity();
                setRecentActivity(Array.isArray(activityRes?.data) ? activityRes.data : []);

            } catch (err) {
                console.error('Error fetching admin dashboard data:', err);
                setError(err?.data?.message || err.message || 'Failed to load admin dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading admin dashboard...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{summary?.totalUsers || '---'}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Students</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{summary?.totalStudents || '---'}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Lecturers</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{summary?.totalLecturers || '---'}</p>
                </div>
            </div>

            {/* Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Appointments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                        <p className="font-medium text-gray-900">Active Appointments</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{summary?.activeAppointments || '---'}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                        <p className="font-medium text-gray-900">Pending Appointments</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">{summary?.pendingAppointments || '---'}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                {recentActivity.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentActivity.map((activity, index) => (
                            <li key={activity.id || activity._id || index} className="py-3 flex items-center">
                                {/* Placeholder for icon */}
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="ml-3 text-sm">
                                    <p className="font-medium text-gray-900">{activity.description}</p>
                                    <p className="text-gray-500">{activity.user?.name || activity.user?.email || activity.context || 'Admin'} - {new Date(activity.timestamp).toLocaleString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No recent activity.</p>
                )}
            </div>
        </div>
    );
}
