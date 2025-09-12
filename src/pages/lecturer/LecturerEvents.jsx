import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import lecturerEventService from '../../services/lecturer/lecturerEventService';

const LecturerEvents = () => {
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
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorEvents, setErrorEvents] = useState(null);

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            setLoadingEvents(true);
            setErrorEvents(null);
            try {
                const response = await lecturerEventService.getUpcomingEvents();
                setUpcomingEvents(response.data || response);
            } catch (err) {
                console.error("Error fetching upcoming events:", err);
                setErrorEvents('Failed to load upcoming events.');
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchUpcomingEvents();
    }, [currentMonth, currentYear]); // Refetch when month/year changes

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
                        const eventOnDay = upcomingEvents.find(
                            (event) => {
                                const eventDate = new Date(event.date);
                                return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
                            }
                        );
                        return (
                            <div
                                key={index}
                                className={`p-2 rounded-full ${day === null
                                    ? 'bg-gray-100'
                                    : eventOnDay
                                        ? 'bg-blue-600 text-white font-bold cursor-pointer'
                                        : 'hover:bg-gray-200 cursor-pointer'
                                    }`}
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
                <Header pageTitle="Events" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Events</h1>
                    <p className="text-gray-600 mb-6">View and manage your upcoming events.</p>

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

                    {/* Upcoming Events List */}
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Events</h2>
                    {loadingEvents && <p>Loading upcoming events list...</p>}
                    {errorEvents && <p className="text-red-500">{errorEvents}</p>}
                    {!loadingEvents && !errorEvents && upcomingEvents.length === 0 && (
                        <p className="text-gray-500">No upcoming events found.</p>
                    )}
                    <div className="space-y-4">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
                                    <FaChevronRight className="h-5 w-5" /> {/* Placeholder icon */}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} {event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerEvents;
