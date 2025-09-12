import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminUserService from '../../services/admin/adminUserService';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [searchQuery, filterRole]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                search: searchQuery,
                role: filterRole,
            };
            const response = await adminUserService.getAllUsers(params);
            setUsers(response.data || response);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminUserService.deleteUser(id);
            fetchUsers(); // Refresh list
        } catch (err) {
            console.error("Error deleting user:", err);
            // Display error to user
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="User Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">User Management</h1>
                    <p className="text-gray-600 mb-6">Manage all users, including students, lecturers, and administrators.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center mb-4">
                            <div className="relative w-full mr-4">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FaSearch className="h-4 w-4 text-gray-500" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or email"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="form-select rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="administrator">Administrator</option>
                                <option value="sys_admin">System Administrator</option>
                            </select>
                        </div>

                        {loading ? (
                            <p>Loading users...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : users.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEdit /></button>
                                                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteUser(user.id)}><FaTrash /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                                    <div className="flex items-center space-x-2">
                                        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">&lt;</button>
                                        <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md">1</button>
                                        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">2</button>
                                        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">3</button>
                                        <span className="text-sm text-gray-700">...</span>
                                        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">10</button>
                                        <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">&gt;</button>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => window.location.href = '/admin/users/create'} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                                            Create New User
                                        </button>
                                        <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                                            Export as PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No users found.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminUsers;
