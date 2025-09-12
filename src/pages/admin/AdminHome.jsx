import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminDashboardService from '../../services/admin/adminDashboardService';
import adminAnalyticsService from '../../services/admin/adminAnalyticsService';

const AdminHome = () => {
    const [platformStats, setPlatformStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await adminAnalyticsService.getOverallPlatformStats();
                setPlatformStats(statsResponse.data || statsResponse);

                const activityResponse = await adminDashboardService.getRecentActivity();
                setRecentActivity(activityResponse.data || activityResponse);

            } catch (err) {
                console.error("Error fetching admin dashboard data:", err);
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
                    <Header pageTitle="Admin Dashboard" />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <p>Loading admin dashboard...</p>
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
                    <Header pageTitle="Admin Dashboard" />
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
                <Header pageTitle="Admin Dashboard" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Admin Dashboard</h1>

                        {/* Platform Statistics */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Platform Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Users</p>
                                <p className="text-3xl text-blue-600 mt-2">{platformStats?.totalUsers || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Active Events</p>
                                <p className="text-3xl text-green-600 mt-2">{platformStats?.activeEvents || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Posts</p>
                                <p className="text-3xl text-purple-600 mt-2">{platformStats?.totalPosts || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="border-b border-gray-200 last:border-b-0 py-3">
                                        <p className="font-medium text-gray-900">{activity.description}</p>
                                        <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminHome;
