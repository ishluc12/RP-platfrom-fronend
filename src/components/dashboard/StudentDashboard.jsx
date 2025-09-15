import { useEffect, useState } from 'react';
import Api from '../../services/api';

export default function StudentDashboard({ user }) {
    const [summary, setSummary] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Fetch student dashboard summary
                const summaryRes = await Api.student.dashboard.summary();
                setSummary(summaryRes?.data || summaryRes);

                // Fetch upcoming events
                const eventsRes = await Api.student.dashboard.upcomingEvents();
                setUpcomingEvents(Array.isArray(eventsRes?.data) ? eventsRes.data : []);

                // Fetch recent posts
                const postsRes = await Api.student.dashboard.recentPosts();
                setRecentPosts(Array.isArray(postsRes?.data) ? postsRes.data : []);

            } catch (err) {
                console.error('Error fetching student dashboard data:', err);
                setError(err?.data?.message || err.message || 'Failed to load student dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user]);

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading student dashboard...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="space-y-8 p-4 md:p-6 lg:p-8">
            {/* Welcome Section - Removed as per image */}

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h3>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event) => (
                            <div key={event.id || event._id} className="group relative block h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-40 w-full overflow-hidden">
                                    {/* Placeholder Image - replace with actual event.imageUrl */}
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No upcoming events.</p>
                )}
            </div>

            {/* Community Feed */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Community Feed</h3>
                {recentPosts.length > 0 ? (
                    <div className="space-y-6">
                        {recentPosts.map((post) => (
                            <div key={post.id || post._id} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="sm:mr-4 mb-4 sm:mb-0 flex-shrink-0">
                                    {/* Placeholder Image - replace with actual post.imageUrl if available */}
                                    <img src={post.imageUrl} alt={post.title} className="w-24 h-24 rounded-lg object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-lg font-semibold text-gray-900">{post.title}</h4>
                                    <p className="text-sm text-gray-700 mt-1">{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                                    <p className="text-xs text-gray-500 mt-2">By <span className="font-medium">{post.author?.name || 'Unknown'}</span> on {new Date(post.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No recent posts in the community feed.</p>
                )}
            </div>

            {/* Summary - Removed from here to match image */}

        </div>
    );
}
