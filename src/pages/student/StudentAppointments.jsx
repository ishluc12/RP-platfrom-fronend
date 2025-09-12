import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import studentAppointmentService from '../../services/student/studentAppointmentService';
import userService from '../../services/shared/userService';

const StudentAppointments = () => {
    const [selectedLecturer, setSelectedLecturer] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [note, setNote] = useState('');
    const [lecturers, setLecturers] = useState([]);
    const [loadingLecturers, setLoadingLecturers] = useState(true);
    const [errorLecturers, setErrorLecturers] = useState(null);
    const [submittingAppointment, setSubmittingAppointment] = useState(false);
    const [appointmentError, setAppointmentError] = useState(null);
    const [appointmentSuccess, setAppointmentSuccess] = useState(false);

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];

    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                const response = await userService.getUsersByRole('lecturer');
                setLecturers(response.data || response);
            } catch (err) {
                console.error("Error fetching lecturers:", err);
                setErrorLecturers('Failed to load lecturers.');
            } finally {
                setLoadingLecturers(false);
            }
        };
        fetchLecturers();
    }, []);

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
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-full cursor-pointer ${day === null
                                    ? 'bg-gray-100'
                                    : selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-200'
                                }`}
                            onClick={() => day && setSelectedDate(new Date(year, month, day))}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleSubmitAppointment = async () => {
        if (!selectedLecturer || !selectedDate || !selectedTime) {
            setAppointmentError('Please select a lecturer, date, and time.');
            return;
        }

        setSubmittingAppointment(true);
        setAppointmentError(null);
        setAppointmentSuccess(false);

        const appointmentData = {
            lecturerId: selectedLecturer,
            appointmentDate: selectedDate.toISOString(), // Or format as needed by backend
            appointmentTime: selectedTime,
            notes: note,
        };

        try {
            await studentAppointmentService.createAppointment(appointmentData);
            setAppointmentSuccess(true);
            // Optionally clear form or navigate
            setSelectedLecturer('');
            setSelectedDate(null);
            setSelectedTime(null);
            setNote('');
        } catch (err) {
            console.error("Error creating appointment:", err);
            setAppointmentError(err.message || 'Failed to request appointment.');
        } finally {
            setSubmittingAppointment(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Appointments" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Appointments</h1>
                    <p className="text-gray-600 mb-6">Schedule appointments with your lecturers for academic support.</p>

                    {appointmentSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Your appointment request has been sent.</span>
                        </div>
                    )}
                    {appointmentError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {appointmentError}</span>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Lecturer</h2>
                        {loadingLecturers && <p>Loading lecturers...</p>}
                        {errorLecturers && <p className="text-red-500">{errorLecturers}</p>}
                        {!loadingLecturers && !errorLecturers && (
                            <select
                                className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={selectedLecturer}
                                onChange={(e) => setSelectedLecturer(e.target.value)}
                            >
                                <option value="">Select a lecturer</option>
                                {lecturers.map((lecturer) => (
                                    <option key={lecturer.id} value={lecturer.id}>
                                        {lecturer.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Time Slots</h2>
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200"><FaChevronLeft /></button>
                            <div className="flex space-x-4">
                                {renderCalendar(currentYear, currentMonth)}
                                {renderCalendar(currentYear, (currentMonth + 1) % 12)}
                            </div>
                            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200"><FaChevronRight /></button>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg text-gray-800 mb-3">Select Time</h3>
                            <div className="flex flex-wrap gap-3">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        className={`px-4 py-2 rounded-md border ${selectedTime === slot ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        onClick={() => setSelectedTime(slot)}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Note</h2>
                        <textarea
                            className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="4"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add a note for your lecturer..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSubmitAppointment}
                            disabled={submittingAppointment}
                        >
                            {submittingAppointment ? 'Requesting...' : 'Request Appointment'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentAppointments;
