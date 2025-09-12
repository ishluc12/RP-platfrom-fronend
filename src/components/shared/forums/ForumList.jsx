import React, { useState, useEffect } from 'react';
import forumService from '../../../services/shared/forumService';
import { Link } from 'react-router-dom';

const ForumList = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForums = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await forumService.getAllForums();
                setForums(response.data || response);
            } catch (err) {
                console.error("Error fetching forums:", err);
                setError('Failed to load forums.');
            } finally {
                setLoading(false);
            }
        };
        fetchForums();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {loading ? (
                <p>Loading forums...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : forums.length > 0 ? (
                <div className="space-y-4">
                    {forums.map((forum) => (
                        <div key={forum.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                            <Link to={`/forums/${forum.id}`} className="block hover:text-blue-600">
                                <h3 className="font-semibold text-lg text-gray-800">{forum.name}</h3>
                                <p className="text-sm text-gray-600">{forum.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Posts: {forum.postCount || 0}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No forums available.</p>
            )}
        </div>
    );
};

export default ForumList;
