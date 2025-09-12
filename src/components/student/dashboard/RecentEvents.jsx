import React, { useState, useEffect } from 'react';
import studentEventService from '../../../services/student/studentEventService';
import { Link } from 'react-router-dom';

const RecentEvents = () => {
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecentEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all events and filter them for recent ones client-side
                // In a real application, the backend API would ideally support 'recent' or date-range filtering
                const response = await studentEventService.getAllEvents();
                const allEvents = response.data || response;

                // Filter for events in the last 30 days and sort by date descending
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const filteredAndSortedEvents = allEvents
                    .filter(event => new Date(event.date) >= thirtyDaysAgo)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5); // Limit to 5 recent events

                setRecentEvents(filteredAndSortedEvents);
            } catch (err) {
                console.error("Error fetching recent events:", err);
                setError('Failed to load recent events.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecentEvents();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Events</h3>
            {loading ? (
                <p>Loading recent events...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : recentEvents.length > 0 ? (
                <div className="space-y-4">
                    {recentEvents.map((event) => (
                        <div key={event.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <Link to={`/student/events/${event.id}`} className="block hover:text-blue-600">
                                <p className="font-medium text-gray-900">{event.title}</p>
                                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No recent events found.</p>
            )}
        </div>
    );
};

export default RecentEvents;
