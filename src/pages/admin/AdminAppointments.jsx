import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminAppointmentService from '../../services/admin/adminAppointmentService'; // Assuming a new admin appointment service
import { FaSearch } from 'react-icons/fa';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLecturer, setFilterLecturer] = useState('');
    const [filterStudent, setFilterStudent] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterTime, setFilterTime] = useState('');

    // Dummy data for filters - replace with actual fetched data
    const lecturers = [{ id: 1, name: 'Dr. Emily Carter' }, { id: 2, name: 'Prof. David Walker' }];
    const students = [{ id: 1, name: 'Liam Bennett' }, { id: 2, name: 'Olivia Harper' }];
    const statuses = ['Active', 'Pending', 'Cancelled', 'Completed'];

    useEffect(() => {
        fetchAppointments();
    }, [searchQuery, filterLecturer, filterStudent, filterStatus, filterDate, filterTime]);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            // This service call needs to be created or adjusted in the backend
            // For now, using a placeholder and client-side filtering
            const response = await adminAppointmentService.getAllAppointments({
                search: searchQuery,
                lecturerId: filterLecturer,
                studentId: filterStudent,
                status: filterStatus,
                date: filterDate,
                time: filterTime,
            });
            setAppointments(response.data || response);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError('Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (id, actionType) => {
        console.log(`Performing ${actionType} on appointment ${id}`);
        // Implement actual API calls here, e.g., to update status or delete
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Appointment Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Appointment Management</h1>
                    <p className="text-gray-600 mb-6">Manage all appointments across the platform.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="relative w-full mb-4">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaSearch className="h-4 w-4 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search appointments by lecturer, student, or date"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                className="form-select rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterLecturer}
                                onChange={(e) => setFilterLecturer(e.target.value)}
                            >
                                <option value="">Lecturer</option>
                                {lecturers.map(lec => <option key={lec.id} value={lec.id}>{lec.name}</option>)}
                            </select>
                            <select
                                className="form-select rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterStudent}
                                onChange={(e) => setFilterStudent(e.target.value)}
                            >
                                <option value="">Student</option>
                                {students.map(stu => <option key={stu.id} value={stu.id}>{stu.name}</option>)}
                            </select>
                            <select
                                className="form-select rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Status</option>
                                {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                            </select>
                            <input
                                type="date"
                                className="form-input rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            <input
                                type="time"
                                className="form-input rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterTime}
                                onChange={(e) => setFilterTime(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : appointments.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecturer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.lecturerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.studentName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'Active' ? 'bg-green-100 text-green-800' : appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => handleAction(appointment.id, 'edit')}>Edit</button>
                                                <button className="text-red-600 hover:text-red-900" onClick={() => handleAction(appointment.id, 'delete')}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">No appointments found.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminAppointments;
