import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminAnalyticsService from '../../services/admin/adminAnalyticsService';

const AdminAnalytics = () => {
    const [platformStats, setPlatformStats] = useState(null);
    const [userGrowth, setUserGrowth] = useState(null);
    const [contentOverview, setContentOverview] = useState(null);
    const [appointmentMetrics, setAppointmentMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await adminAnalyticsService.getOverallPlatformStats();
                setPlatformStats(statsResponse.data || statsResponse);

                const userGrowthResponse = await adminAnalyticsService.getUserGrowthAnalytics();
                setUserGrowth(userGrowthResponse.data || userGrowthResponse);

                const contentOverviewResponse = await adminAnalyticsService.getContentOverview();
                setContentOverview(contentOverviewResponse.data || contentOverviewResponse);

                const appointmentMetricsResponse = await adminAnalyticsService.getAppointmentMetrics();
                setAppointmentMetrics(appointmentMetricsResponse.data || appointmentMetricsResponse);

            } catch (err) {
                console.error("Error fetching admin analytics data:", err);
                setError('Failed to load analytics data.');
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
                    <Header pageTitle="Admin Analytics" />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <p>Loading analytics...</p>
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
                    <Header pageTitle="Admin Analytics" />
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
                <Header pageTitle="Admin Analytics" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Admin Analytics</h1>
                        <p className="text-gray-600 mb-6">Comprehensive insights into platform usage and performance.</p>

                        {/* Overall Platform Stats */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Platform Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Users</p>
                                <p className="text-3xl text-blue-600 mt-2">{platformStats?.totalUsers || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Active Today</p>
                                <p className="text-3xl text-green-600 mt-2">{platformStats?.activeToday || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">New Registrations (Last 7 Days)</p>
                                <p className="text-3xl text-purple-600 mt-2">{platformStats?.newRegistrationsLast7Days || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Events</p>
                                <p className="text-3xl text-red-600 mt-2">{platformStats?.totalEvents || 'N/A'}</p>
                            </div>
                        </div>

                        {/* User Growth Analytics */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Growth</h2>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <p className="text-lg font-semibold text-gray-800">Monthly Registrations</p>
                            <p className="text-3xl text-blue-600 mt-2">{userGrowth?.monthlyRegistrations || 'N/A'}</p>
                            {/* Chart or more detailed data would go here */}
                            <p className="text-gray-600 mt-2">Trend: {userGrowth?.trend || 'N/A'}</p>
                        </div>

                        {/* Content Overview */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Content Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Posts</p>
                                <p className="text-3xl text-purple-600 mt-2">{contentOverview?.totalPosts || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Forums</p>
                                <p className="text-3xl text-teal-600 mt-2">{contentOverview?.totalForums || 'N/A'}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg font-semibold text-gray-800">Total Polls</p>
                                <p className="text-3xl text-orange-600 mt-2">{contentOverview?.totalPolls || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Appointment Metrics */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Metrics</h2>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-lg font-semibold text-gray-800">Total Appointments</p>
                            <p className="text-3xl text-indigo-600 mt-2">{appointmentMetrics?.totalAppointments || 'N/A'}</p>
                            <p className="text-gray-600 mt-2">Completed: {appointmentMetrics?.completedAppointments || 'N/A'}, Pending: {appointmentMetrics?.pendingAppointments || 'N/A'}</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAnalytics;
