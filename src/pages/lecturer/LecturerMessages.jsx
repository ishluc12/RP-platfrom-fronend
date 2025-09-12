import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import messageService from '../../services/shared/messageService';
import userService from '../../services/shared/userService';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';

const LecturerMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [errorConversations, setErrorConversations] = useState(null);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errorMessages, setErrorMessages] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoadingConversations(true);
                const response = await messageService.getUserConversations();
                setConversations(response.data || response);
            } catch (err) {
                console.error("Error fetching conversations:", err);
                setErrorConversations('Failed to load conversations.');
            } finally {
                setLoadingConversations(false);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (currentConversation) {
            const fetchMessages = async () => {
                try {
                    setLoadingMessages(true);
                    const response = await messageService.getConversationThread(currentConversation.otherUserId);
                    setMessages(response.data || response);
                } catch (err) {
                    console.error("Error fetching messages:", err);
                    setErrorMessages('Failed to load messages.');
                } finally {
                    setLoadingMessages(false);
                }
            };
            fetchMessages();
        }
    }, [currentConversation]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentConversation) return;

        setSendingMessage(true);
        try {
            const messageData = {
                receiver_id: currentConversation.otherUserId,
                message: newMessage,
                is_group: false,
            };
            await messageService.sendMessage(messageData);
            setNewMessage('');
            // Refresh messages after sending
            const response = await messageService.getConversationThread(currentConversation.otherUserId);
            setMessages(response.data || response);
        } catch (err) {
            console.error("Error sending message:", err);
            // Display error to user
        } finally {
            setSendingMessage(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Messages" />
                <main className="flex-1 flex bg-gray-200">
                    {/* Conversation List */}
                    <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <FaSearch className="h-4 w-4 text-gray-500" />
                                </span>
                                <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loadingConversations ? (
                                <p className="p-4">Loading conversations...</p>
                            ) : errorConversations ? (
                                <p className="p-4 text-red-500">{errorConversations}</p>
                            ) : conversations.length > 0 ? (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${currentConversation?.id === conv.id ? 'bg-blue-100' : ''
                                            }`}
                                        onClick={() => setCurrentConversation(conv)}
                                    >
                                        <img src={conv.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className="h-10 w-10 rounded-full mr-3" />
                                        <div>
                                            <p className="font-semibold">{conv.name}</p>
                                            <p className="text-sm text-gray-500">{conv.lastMessage}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="p-4 text-gray-500">No conversations found.</p>
                            )}
                        </div>
                    </div>

                    {/* Message Window */}
                    <div className="flex-1 flex flex-col">
                        {currentConversation ? (
                            <>
                                <div className="bg-white border-b border-gray-200 p-4 flex items-center">
                                    <img src={currentConversation.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className="h-10 w-10 rounded-full mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-800">{currentConversation.name}</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {loadingMessages ? (
                                        <p>Loading messages...</p>
                                    ) : errorMessages ? (
                                        <p className="text-red-500">{errorMessages}</p>
                                    ) : messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`px-4 py-2 rounded-lg max-w-xs ${msg.senderId === user.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
                                                        }`}
                                                >
                                                    <p>{msg.message}</p>
                                                    <span className="text-xs opacity-75 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center">No messages in this conversation.</p>
                                    )}
                                </div>
                                <div className="bg-white border-t border-gray-200 p-4 flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Write a message..."
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 mr-3"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                                        disabled={sendingMessage}
                                    />
                                    <button
                                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSendMessage}
                                        disabled={sendingMessage}
                                    >
                                        <FaPaperPlane className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a conversation to view messages
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LecturerMessages;
