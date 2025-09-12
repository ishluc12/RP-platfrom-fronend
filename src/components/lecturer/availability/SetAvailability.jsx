import React, { useState } from 'react';
import lecturerAvailabilityService from '../../../services/lecturer/lecturerAvailabilityService';
import { FaPlus } from 'react-icons/fa';

const SetAvailability = ({ onAvailabilitySet }) => {
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startTime || !endTime) {
            setError('Please select both start and end times.');
            return;
        }
        if (startTime >= endTime) {
            setError('End time must be after start time.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const availabilityData = {
                dayOfWeek,
                startTime,
                endTime,
            };
            await lecturerAvailabilityService.setLecturerAvailability(availabilityData);
            setSuccess(true);
            setStartTime('');
            setEndTime('');
            onAvailabilitySet(); // Refresh the parent's availability list
        } catch (err) {
            console.error("Error setting availability:", err);
            setError(err.message || 'Failed to set availability.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Set New Availability</h2>
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Availability added successfully.</span>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">Day of Week</label>
                    <select
                        id="dayOfWeek"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(e.target.value)}
                        required
                    >
                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="time"
                            id="startTime"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="time"
                            id="endTime"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <FaPlus className="inline-block mr-2" />
                        {loading ? 'Setting...' : 'Set Availability'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SetAvailability;
