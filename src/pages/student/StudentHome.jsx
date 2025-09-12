import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
// import PostCard from '../../components/common/PostCard'; // Not directly used here, but keep if needed elsewhere
import studentDashboardService from '../../services/student/studentDashboardService';
import postService from '../../services/shared/postService';

const StudentHome = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [communityFeedItems, setCommunityFeedItems] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingFeed, setLoadingFeed] = useState(true);
    const [errorEvents, setErrorEvents] = useState(null);
    const [errorFeed, setErrorFeed] = useState(null);

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                const response = await studentDashboardService.getUpcomingEvents();
                setUpcomingEvents(response.data || response);
            } catch (err) {
                console.error("Error fetching upcoming events:", err);
                setErrorEvents('Failed to load upcoming events.');
            } finally {
                setLoadingEvents(false);
            }
        };

        const fetchCommunityFeed = async () => {
            try {
                const response = await postService.getFeed();
                setCommunityFeedItems(response.data || response);
            } catch (err) {
                console.error("Error fetching community feed:", err);
                setErrorFeed('Failed to load community feed.');
            } finally {
                setLoadingFeed(false);
            }
        };

        fetchUpcomingEvents();
        fetchCommunityFeed();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Dashboard" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Events</h2>
                        {loadingEvents && <p>Loading upcoming events...</p>}
                        {errorEvents && <p className="text-red-500">{errorEvents}</p>}
                        {!loadingEvents && !errorEvents && upcomingEvents.length === 0 && (
                            <p>No upcoming events found.</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img src={event.image || '/src/assets/images/placeholder.jpg'} alt={event.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mt-2">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Community Feed</h2>
                        {loadingFeed && <p>Loading community feed...</p>}
                        {errorFeed && <p className="text-red-500">{errorFeed}</p>}
                        {!loadingFeed && !errorFeed && communityFeedItems.length === 0 && (
                            <p>No community feed items found.</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communityFeedItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                                    <div className="p-4 flex-1">
                                        <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                                        <p className="text-gray-600 text-sm mt-2">{item.content || item.description}</p>
                                    </div>
                                    <img src={item.image || '/src/assets/images/placeholder.jpg'} alt={item.title} className="w-32 h-32 object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentHome;
