import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import pollService from '../../services/shared/pollService'; // Reusing shared poll service
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const AdminPolls = () => {
    const [activePolls, setActivePolls] = useState([]);
    const [closedPolls, setClosedPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPollTitle, setNewPollTitle] = useState('');
    const [newPollEndDate, setNewPollEndDate] = useState('');
    const [newPollOptions, setNewPollOptions] = useState(['', '']);
    const [submittingPoll, setSubmittingPoll] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await pollService.getAllPolls();
            const polls = response.data || response;
            const now = new Date();
            setActivePolls(polls.filter(poll => new Date(poll.endDate) > now));
            setClosedPolls(polls.filter(poll => new Date(poll.endDate) <= now));
        } catch (err) {
            console.error("Error fetching polls:", err);
            setError('Failed to load polls.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddOption = () => {
        setNewPollOptions([...newPollOptions, '']);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...newPollOptions];
        updatedOptions[index] = value;
        setNewPollOptions(updatedOptions);
    };

    const handleCreatePoll = async () => {
        if (!newPollTitle.trim() || !newPollEndDate.trim() || newPollOptions.filter(opt => opt.trim()).length < 2) {
            setSubmitError('Title, end date, and at least two options are required.');
            return;
        }

        setSubmittingPoll(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const pollData = {
                title: newPollTitle,
                endDate: newPollEndDate,
                options: newPollOptions.filter(opt => opt.trim()),
            };
            await pollService.createPoll(pollData); // Assuming createPoll exists in shared service
            setSubmitSuccess(true);
            setShowCreateModal(false);
            setNewPollTitle('');
            setNewPollEndDate('');
            setNewPollOptions(['', '']);
            fetchPolls(); // Refresh list
        } catch (err) {
            console.error("Error creating poll:", err);
            setSubmitError(err.message || 'Failed to create poll.');
        } finally {
            setSubmittingPoll(false);
        }
    };

    const handleDeletePoll = async (id) => {
        if (!window.confirm('Are you sure you want to delete this poll?')) return;
        try {
            await pollService.deletePoll(id);
            fetchPolls(); // Refresh list
        } catch (err) {
            console.error("Error deleting poll:", err);
            // Display error to user
        }
    };

    const renderPollTable = (polls) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poll Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {polls.map((poll) => (
                        <tr key={poll.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{poll.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${new Date(poll.endDate) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {new Date(poll.endDate) > new Date() ? 'Active' : 'Closed'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(poll.endDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3"><FaEye /> View Results</button>
                                <button className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /> Edit</button>
                                <button className="text-red-600 hover:text-red-900" onClick={() => handleDeletePoll(poll.id)}><FaTrash /> Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Polls Management" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-800">Polls Management</h1>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 flex items-center"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FaPlus className="mr-2" /> Create New Poll
                        </button>
                    </div>
                    <p className="text-gray-600 mb-6">Create and manage polls for the RP Community Platform.</p>

                    {submitSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Poll created successfully.</span>
                        </div>
                    )}
                    {submitError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {submitError}</span>
                        </div>
                    )}

                    {loading ? (
                        <p>Loading polls...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Polls</h2>
                            {activePolls.length > 0 ? renderPollTable(activePolls) : <p className="text-gray-500 mb-8">No active polls.</p>}

                            <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Closed Polls</h2>
                            {closedPolls.length > 0 ? renderPollTable(closedPolls) : <p className="text-gray-500">No closed polls.</p>}
                        </>
                    )}
                </main>
            </div>

            {/* Create Poll Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Create New Poll</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="poll-title">Title</label>
                            <input
                                type="text"
                                id="poll-title"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newPollTitle}
                                onChange={(e) => setNewPollTitle(e.target.value)}
                                placeholder="Enter poll title"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="poll-end-date">End Date</label>
                            <input
                                type="date"
                                id="poll-end-date"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newPollEndDate}
                                onChange={(e) => setNewPollEndDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Options</label>
                            {newPollOptions.map((option, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                />
                            ))}
                            <button
                                className="px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded-md hover:bg-gray-600"
                                onClick={handleAddOption}
                            >
                                Add Option
                            </button>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleCreatePoll}
                                disabled={submittingPoll}
                            >
                                {submittingPoll ? 'Creating...' : 'Create Poll'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPolls;
