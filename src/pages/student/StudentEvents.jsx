import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import studentEventService from '../../services/student/studentEventService';

const StudentEvents = () => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateCalendarDays = (year, month) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = getDaysInMonth(year, month);
        const calendarDays = [];

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(i);
        }
        return calendarDays;
    };

    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventsData, setEventsData] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorEvents, setErrorEvents] = useState(null);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpError, setRsvpError] = useState(null);
    const [rsvpSuccess, setRsvpSuccess] = useState(false);

    useEffect(() => {
        const fetchAllEvents = async () => {
            try {
                setLoadingEvents(true);
                const response = await studentEventService.getAllEvents();
                setEventsData(response.data || response);
            } catch (err) {
                console.error("Error fetching events:", err);
                setErrorEvents('Failed to load events.');
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchAllEvents();
    }, []);

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleRsvp = async (eventId) => {
        setRsvpLoading(true);
        setRsvpError(null);
        setRsvpSuccess(false);
        try {
            await studentEventService.rsvpToEvent(eventId);
            setRsvpSuccess(true);
            // Optionally refresh events or update local state
        } catch (err) {
            console.error("Error RSVPing to event:", err);
            setRsvpError(err.message || 'Failed to RSVP.');
        } finally {
            setRsvpLoading(false);
        }
    };

    const renderCalendar = (year, month) => {
        const days = generateCalendarDays(year, month);
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">{monthName} {year}</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="font-medium text-gray-500">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {days.map((day, index) => {
                        const eventOnDay = eventsData.find(
                            (event) => {
                                const eventDate = new Date(event.date);
                                return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
                            }
                        );
                        return (
                            <div
                                key={index}
                                className={`p-2 rounded-full cursor-pointer ${day === null
                                        ? 'bg-gray-100'
                                        : eventOnDay
                                            ? 'bg-blue-600 text-white font-bold'
                                            : 'hover:bg-gray-200'
                                    }`}
                                onClick={() => day && eventOnDay && setSelectedEvent(eventOnDay)}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Upcoming Events" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Upcoming Events</h1>
                    <p className="text-gray-600 mb-6">Stay informed about all the exciting events happening on campus. From workshops to soc gatherings, there's something for everyone.</p>

                    {rsvpSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> You have successfully RSVP'd to the event.</span>
                        </div>
                    )}
                    {rsvpError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {rsvpError}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200"><FaChevronLeft /></button>
                            <div className="flex space-x-4">
                                {loadingEvents ? (
                                    <p>Loading calendar...</p>
                                ) : errorEvents ? (
                                    <p className="text-red-500">{errorEvents}</p>
                                ) : (
                                    <>
                                        {renderCalendar(currentYear, currentMonth)}
                                        {renderCalendar(currentYear, (currentMonth + 1) % 12)}
                                    </>
                                )}
                            </div>
                            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200"><FaChevronRight /></button>
                        </div>
                    </div>

                    {selectedEvent && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Details</h2>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">{selectedEvent.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{selectedEvent.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                                <div>
                                    <p><span className="font-medium">Date:</span> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Time:</span> {selectedEvent.time}</p>
                                </div>
                                <div>
                                    <p><span className="font-medium">Location:</span> {selectedEvent.location}</p>
                                </div>
                            </div>
                            <button
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleRsvp(selectedEvent.id)}
                                disabled={rsvpLoading}
                            >
                                {rsvpLoading ? 'RSVPing...' : 'RSVP'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentEvents;
