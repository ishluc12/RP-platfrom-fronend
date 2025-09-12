import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import studentSurveyService from '../../services/student/studentSurveyService'; // Using studentSurveyService for feedback as backend routes are shared
import { FaSearch } from 'react-icons/fa';

const LecturerFeedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                // Assuming 'feedback' maps to surveys in this context
                // You might need a specific endpoint for 'lecturer feedback' if it exists
                const response = await studentSurveyService.listStudentSurveys(); // Or a more appropriate service call
                setFeedbackList(response.data || response);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError('Failed to load feedback.');
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    const filteredFeedback = feedbackList.filter(feedback =>
        feedback.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.feedbackContent?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Feedback" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Feedback</h1>
                    <p className="text-gray-600 mb-6">View feedback from students on courses and other academic aspects.</p>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="relative mb-4">
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

                        {loading ? (
                            <p>Loading feedback...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : filteredFeedback.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFeedback.map((feedback) => (
                                        <tr key={feedback.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feedback.courseName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{feedback.feedbackContent}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">No feedback available.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerFeedback;
