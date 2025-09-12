import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import studentSurveyService from '../../services/student/studentSurveyService'; // Assuming feedback comes from surveys
import { FaSearch } from 'react-icons/fa';

const AdminFeedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Feedback'); // 'All Feedback', 'Lecturer Feedback', 'Student Feedback'

    useEffect(() => {
        fetchFeedback();
    }, [searchQuery, filterType]);

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await studentSurveyService.listStudentSurveys(); // Adjust to admin-specific feedback API if available
            let filteredData = response.data || response;

            if (filterType === 'Lecturer Feedback') {
                filteredData = filteredData.filter(item => item.feedbackType === 'Lecturer');
            } else if (filterType === 'Student Feedback') {
                filteredData = filteredData.filter(item => item.feedbackType === 'Student');
            }

            setFeedbackList(filteredData.filter(feedback =>
                feedback.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feedback.userName?.toLowerCase().includes(searchQuery.toLowerCase())
            ));
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setError('Failed to load feedback.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Feedback Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Feedback Management</h1>
                    <p className="text-gray-600 mb-6">View and manage all user feedback submitted through the platform.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="relative w-full mb-4">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <FaSearch className="h-4 w-4 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search feedback"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <button
                                className={`px-4 py-2 rounded-md font-semibold ${filterType === 'All Feedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                onClick={() => setFilterType('All Feedback')}
                            >
                                All Feedback
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md font-semibold ${filterType === 'Lecturer Feedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                onClick={() => setFilterType('Lecturer Feedback')}
                            >
                                Lecturer Feedback
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md font-semibold ${filterType === 'Student Feedback' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                onClick={() => setFilterType('Student Feedback')}
                            >
                                Student Feedback
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading feedback...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : feedbackList.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {feedbackList.map((feedback) => (
                                        <tr key={feedback.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(feedback.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.userName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.feedbackType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{feedback.content}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No feedback available.</p>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                                Export as PDF
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminFeedback;
