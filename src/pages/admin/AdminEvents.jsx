import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminEventService from '../../services/admin/adminEventService';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [searchQuery]);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { search: searchQuery };
            const response = await adminEventService.getAllEvents(params);
            setEvents(response.data || response);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError('Failed to load events.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await adminEventService.deleteEvent(id);
            fetchEvents(); // Refresh list
        } catch (err) {
            console.error("Error deleting event:", err);
            // Display error to user
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Event Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">Event Management</h1>
                        <button
                            onClick={() => window.location.href = '/admin/events/create'}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                        >
                            New Event
                        </button>
                    </div>
                    <p className="text-gray-600 mb-6">Manage all events created on the platform.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="relative w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaSearch className="h-4 w-4 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search events by title or description"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading events...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <img src={event.image || '/src/assets/images/placeholder.jpg'} alt={event.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                        <p className="text-xs text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
                                        <div className="mt-4 flex justify-end">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEdit /></button>
                                            <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteEvent(event.id)}><FaTrash /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No events found.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminEvents;
