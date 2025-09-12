import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import userService from '../../services/shared/userService';

const Directory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    // const [selectedYear, setSelectedYear] = useState(''); // This might need to be adjusted based on backend user data
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [errorUsers, setErrorUsers] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            setErrorUsers(null);
            try {
                const params = {
                    search: searchQuery,
                    role: selectedRole,
                    department: selectedDepartment,
                    // year: selectedYear, // Uncomment if backend supports year filtering
                };
                const response = await userService.searchUsers(params);
                setUsers(response.data || response);
            } catch (err) {
                console.error("Error fetching users:", err);
                setErrorUsers('Failed to load users.');
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, [searchQuery, selectedRole, selectedDepartment]);

    const filteredStudents = users.filter(user => user.role === 'student');
    const filteredLecturers = users.filter(user => user.role === 'lecturer');

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Directory" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Directory</h1>
                    <p className="text-gray-600 mb-6">Find students and lecturers within the RP Community.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center mb-4">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            </span>
                            <input
                                className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10 pr-4"
                                type="text"
                                placeholder="Search by name or role"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                className="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">Role</option>
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                            </select>

                            <select
                                className="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                            >
                                <option value="">Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Biology">Biology</option>
                            </select>

                            <select
                                className="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Year</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Students</h2>
                    {loadingUsers && selectedRole !== 'lecturer' && <p>Loading students...</p>}
                    {errorUsers && selectedRole !== 'lecturer' && <p className="text-red-500">{errorUsers}</p>}
                    {!loadingUsers && !errorUsers && filteredStudents.length === 0 && selectedRole !== 'lecturer' && (
                        <p className="text-gray-500">No students found.</p>
                    )}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {filteredStudents.map((user) => (
                            <div key={user.id} className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
                                <img src={user.profilePic || 'https://via.placeholder.com/150'} alt={user.name} className="h-10 w-10 rounded-full object-cover mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.department}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Lecturers</h2>
                    {loadingUsers && selectedRole !== 'student' && <p>Loading lecturers...</p>}
                    {errorUsers && selectedRole !== 'student' && <p className="text-red-500">{errorUsers}</p>}
                    {!loadingUsers && !errorUsers && filteredLecturers.length === 0 && selectedRole !== 'student' && (
                        <p className="text-gray-500">No lecturers found.</p>
                    )}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {filteredLecturers.map((user) => (
                            <div key={user.id} className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
                                <img src={user.profilePic || 'https://via.placeholder.com/150'} alt={user.name} className="h-10 w-10 rounded-full object-cover mr-4" />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.department}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Directory;
