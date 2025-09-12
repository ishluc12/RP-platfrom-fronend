import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import SetAvailability from '../../components/lecturer/availability/SetAvailability';
import AvailabilityCalendar from '../../components/lecturer/availability/AvailabilityCalendar';
import lecturerAvailabilityService from '../../services/lecturer/lecturerAvailabilityService';

const LecturerAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await lecturerAvailabilityService.getLecturerAvailability();
            setAvailability(response.data || response);
        } catch (err) {
            console.error("Error fetching availability:", err);
            setError('Failed to load availability.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAvailability = async (updatedSlot) => {
        try {
            await lecturerAvailabilityService.updateAvailability(updatedSlot.id, updatedSlot);
            fetchAvailability(); // Refresh list
        } catch (err) {
            console.error("Error updating availability:", err);
            setError('Failed to update availability.');
        }
    };

    const handleDeleteAvailability = async (id) => {
        if (!window.confirm('Are you sure you want to delete this availability slot?')) return;
        try {
            await lecturerAvailabilityService.deleteAvailability(id);
            fetchAvailability(); // Refresh list
        } catch (err) {
            console.error("Error deleting availability:", err);
            setError('Failed to delete availability.');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="My Availability" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">My Availability</h1>
                    <p className="text-gray-600 mb-6">Manage your weekly availability for student appointments and meetings.</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SetAvailability onAvailabilitySet={fetchAvailability} />
                        <AvailabilityCalendar
                            availability={availability}
                            loading={loading}
                            onUpdate={handleUpdateAvailability}
                            onDelete={handleDeleteAvailability}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerAvailability;
