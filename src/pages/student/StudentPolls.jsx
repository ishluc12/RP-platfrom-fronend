import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import pollService from '../../services/shared/pollService';

const StudentPolls = () => {
    const [polls, setPolls] = useState([]);
    const [loadingPolls, setLoadingPolls] = useState(true);
    const [errorPolls, setErrorPolls] = useState(null);
    const [votingLoading, setVotingLoading] = useState(false);
    const [votingError, setVotingError] = useState(null);
    const [votingSuccess, setVotingSuccess] = useState(false);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await pollService.getAllPolls();
                setPolls(response.data || response);
            } catch (err) {
                console.error("Error fetching polls:", err);
                setErrorPolls('Failed to load polls.');
            } finally {
                setLoadingPolls(false);
            }
        };
        fetchPolls();
    }, []);

    const handleVote = async (pollId, optionId) => {
        setVotingLoading(true);
        setVotingError(null);
        setVotingSuccess(false);
        try {
            await pollService.voteOnPoll({ pollId, optionId });
            setVotingSuccess(true);
            // Optionally refresh polls or update local state
            setPolls(prevPolls =>
                prevPolls.map(poll =>
                    poll.id === pollId ? { ...poll, /* update with new results if available */ } : poll
                )
            );
        } catch (err) {
            console.error("Error voting on poll:", err);
            setVotingError(err.message || 'Failed to cast vote.');
        } finally {
            setVotingLoading(false);
        }
    };

    const activePolls = polls.filter(poll => poll.status === 'active');
    const pastPolls = polls.filter(poll => poll.status === 'past');

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Polls" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-2">Polls</h1>
                    <p className="text-gray-600 mb-6">Participate in active polls or view results of past polls.</p>

                    {votingSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> Your vote has been cast.</span>
                        </div>
                    )}
                    {votingError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {votingError}</span>
                        </div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Polls</h2>
                    {loadingPolls && <p>Loading active polls...</p>}
                    {errorPolls && <p className="text-red-500">{errorPolls}</p>}
                    {!loadingPolls && !errorPolls && activePolls.length === 0 && (
                        <p>No active polls found.</p>
                    )}
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        {activePolls.map((poll) => (
                            <div key={poll.id} className="relative bg-white rounded-lg shadow-md overflow-hidden flex items-center">
                                <img src={poll.image || '/src/assets/images/placeholder.jpg'} alt={poll.title} className="w-48 h-32 object-cover" />
                                <div className="p-4 flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">{poll.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{poll.description}</p>
                                </div>
                                <button
                                    className="absolute right-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleVote(poll.id, poll.options[0].id)} // Assuming first option for simplicity
                                    disabled={votingLoading}
                                >
                                    {votingLoading ? 'Voting...' : 'Participate'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Polls</h2>
                    {loadingPolls && <p>Loading past polls...</p>}
                    {errorPolls && <p className="text-red-500">{errorPolls}</p>}
                    {!loadingPolls && !errorPolls && pastPolls.length === 0 && (
                        <p>No past polls found.</p>
                    )}
                    <div className="grid grid-cols-1 gap-6">
                        {pastPolls.map((poll) => (
                            <div key={poll.id} className="relative bg-white rounded-lg shadow-md overflow-hidden flex items-center">
                                <img src={poll.image || '/src/assets/images/placeholder.jpg'} alt={poll.title} className="w-48 h-32 object-cover" />
                                <div className="p-4 flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">{poll.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{poll.description}</p>
                                </div>
                                <button
                                    className="absolute right-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
                                    onClick={() => console.log('View results for poll:', poll.id)}
                                >
                                    View result
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentPolls;
