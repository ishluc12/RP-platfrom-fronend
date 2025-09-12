import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import lecturerAppointmentService from '../../services/lecturer/lecturerAppointmentService';

const LecturerAppointments = () => {
    const [appointmentRequests, setAppointmentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await lecturerAppointmentService.listAppointments();
            // Filter for pending appointments initially, or handle status in backend
            setAppointmentRequests(response.data.filter(app => app.status === 'pending') || []);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError('Failed to load appointment requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        try {
            await lecturerAppointmentService.updateAppointmentStatus(id, status);
            setActionSuccess(`Appointment ${status} successfully.`);
            fetchAppointments(); // Refresh the list
        } catch (err) {
            console.error(`Error ${status} appointment:`, err);
            setActionError(`Failed to ${status} appointment.`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header pageTitle="Appointments" />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <p>Loading appointments...</p>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header pageTitle="Appointments" />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                        <p className="text-red-500">{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Appointments" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Appointments</h1>
                    <p className="text-gray-600 mb-6">Manage your student appointment requests.</p>

                    {actionSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> {actionSuccess}</span>
                        </div>
                    )}
                    {actionError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {actionError}</span>
                        </div>
                    )}

                    {/* Appointment Requests */}
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Appointment Requests</h2>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointmentRequests.length > 0 ? (
                                    appointmentRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.studentName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${new Date(request.appointmentDate).toLocaleDateString()} ${request.appointmentTime}`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed mr-3"
                                                            onClick={() => handleUpdateStatus(request.id, 'accepted')}
                                                            disabled={actionLoading}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                                            disabled={actionLoading}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No appointment requests.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerAppointments;
