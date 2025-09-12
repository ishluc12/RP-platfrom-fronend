import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import adminUserService from '../../services/admin/adminUserService';
import { useNavigate } from 'react-router-dom';

const AdminCreateUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        if (!name.trim() || !email.trim() || !role.trim()) {
            setError('Please fill in all required fields.');
            setSubmitting(false);
            return;
        }

        try {
            const userData = {
                name,
                email,
                registrationNumber: role === 'student' ? registrationNumber : undefined, // Only for students
                role,
                password: 'defaultpassword', // Placeholder - actual password should be set by user or generated securely
            };
            await adminUserService.createUser(userData);
            setSuccess(true);
            setName('');
            setEmail('');
            setRegistrationNumber('');
            setRole('student');
            setTimeout(() => navigate('/admin/users'), 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error("Error creating user:", err);
            setError(err.message || 'Failed to create user account.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Create User Account" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Create User Account</h1>
                    <p className="text-gray-600 mb-6">Create new user accounts for students and lecturers.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-2xl mx-auto">
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Success!</strong>
                                <span className="block sm:inline"> User account created successfully. Redirecting...</span>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error!</strong>
                                <span className="block sm:inline"> {error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter user's full name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter user's email address"
                                    required
                                />
                            </div>
                            {role === 'student' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationNumber">
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        id="registrationNumber"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={registrationNumber}
                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                        placeholder="Enter user's registration number"
                                    />
                                </div>
                            )}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <div className="mt-2">
                                    <label className="inline-flex items-center mr-4">
                                        <input
                                            type="radio"
                                            className="form-radio text-blue-600"
                                            name="role"
                                            value="student"
                                            checked={role === 'student'}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <span className="ml-2">Student</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            className="form-radio text-blue-600"
                                            name="role"
                                            value="lecturer"
                                            checked={role === 'lecturer'}
                                            onChange={(e) => setRole(e.target.value)}
                                        />
                                        <span className="ml-2">Lecturer</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminCreateUser;
