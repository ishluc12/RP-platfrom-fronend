import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AvailabilityCalendar = ({ availability, loading, onUpdate, onDelete }) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (loading) {
        return <div className="bg-white rounded-lg shadow-md p-6">Loading availability calendar...</div>;
    }

    const availabilityByDay = daysOfWeek.reduce((acc, day) => {
        acc[day] = availability.filter(slot => slot.dayOfWeek === day);
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Current Availability</h2>
            {Object.keys(availabilityByDay).map(day => (
                <div key={day} className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">{day}</h3>
                    {availabilityByDay[day].length > 0 ? (
                        <div className="space-y-2">
                            {availabilityByDay[day].map(slot => (
                                <div key={slot.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <p className="text-sm text-gray-800">{slot.startTime} - {slot.endTime}</p>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => onUpdate(slot)} // Implement update logic in parent or modal
                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                            title="Edit availability"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => onDelete(slot.id)}
                                            className="text-red-600 hover:text-red-900 text-sm"
                                            title="Delete availability"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No availability set for {day}.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AvailabilityCalendar;
