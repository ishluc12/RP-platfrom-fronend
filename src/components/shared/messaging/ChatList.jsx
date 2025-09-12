import React, { useState, useEffect } from 'react';
import messageService from '../../../services/shared/messageService';
import chatGroupService from '../../../services/shared/chatGroupsService';
import { FaUserCircle, FaUsers, FaSearch } from 'react-icons/fa';

const ChatList = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'groups'

    useEffect(() => {
        fetchConversations();
    }, [activeTab, searchQuery]);

    const fetchConversations = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'direct') {
                const response = await messageService.getUserConversations();
                setConversations(response.data || response);
                setGroupChats([]);
            } else {
                const response = await messageService.getUserGroupChats();
                setGroupChats(response.data || response);
                setConversations([]);
            }
        } catch (err) {
            console.error("Error fetching chat list:", err);
            setError('Failed to load chats.');
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroupChats = groupChats.filter(group =>
        group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
                <div className="relative mb-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <FaSearch className="h-4 w-4 text-gray-500" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search chats"
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        className={`flex-1 px-4 py-2 rounded-md font-medium ${activeTab === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('direct')}
                    >
                        Direct Messages
                    </button>
                    <button
                        className={`flex-1 px-4 py-2 rounded-md font-medium ${activeTab === 'groups' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('groups')}
                    >
                        Group Chats
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <p className="p-4 text-gray-600">Loading chats...</p>
                ) : error ? (
                    <p className="p-4 text-red-500">{error}</p>
                ) : activeTab === 'direct' ? (
                    filteredConversations.length > 0 ? (
                        <div className="space-y-1 p-2">
                            {filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                    onClick={() => onSelectConversation(conversation.id, 'direct')}
                                >
                                    <FaUserCircle className="h-8 w-8 text-gray-500 mr-3" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{conversation.otherUserName}</p>
                                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="p-4 text-gray-600">No direct messages found.</p>
                    )
                ) : (
                    filteredGroupChats.length > 0 ? (
                        <div className="space-y-1 p-2">
                            {filteredGroupChats.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                    onClick={() => onSelectConversation(group.id, 'group')}
                                >
                                    <FaUsers className="h-8 w-8 text-gray-500 mr-3" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{group.name}</p>
                                        <p className="text-sm text-gray-600 truncate">{group.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="p-4 text-gray-600">No group chats found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ChatList;
