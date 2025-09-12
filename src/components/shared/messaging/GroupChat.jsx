import React, { useState, useEffect, useRef } from 'react';
import messageService from '../../../services/shared/messageService';
import chatGroupService from '../../../services/shared/chatGroupsService';
import { FaPaperPlane, FaTimesCircle, FaUsers, FaPlus, FaCog } from 'react-icons/fa';
import MessageBubble from './MessageBubble';

const GroupChat = ({ groupId, groupName, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [groupDetails, setGroupDetails] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (groupId) {
            fetchGroupData();
        }
    }, [groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchGroupData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [messagesResponse, groupDetailsResponse] = await Promise.all([
                messageService.getGroupMessages(groupId),
                chatGroupService.getChatGroupById(groupId) // Fetch group details
            ]);
            setMessages(messagesResponse.data || messagesResponse);
            setGroupDetails(groupDetailsResponse.data || groupDetailsResponse);
        } catch (err) {
            console.error("Error fetching group chat data:", err);
            setError('Failed to load group chat.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                message: newMessage,
                is_group: true,
                group_id: groupId,
            };

            const response = await messageService.sendMessage(messageData);
            setMessages(prevMessages => [...prevMessages, response.data || response]);
            setNewMessage('');
        } catch (err) {
            console.error("Error sending message:", err);
            setError('Failed to send message.');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!groupId) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a group chat to start messaging.
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 bg-white border-l border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">{groupDetails?.name || groupName || 'Group Chat'}</h2>
                <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-gray-700"><FaUsers className="h-5 w-5" /></button>
                    <button className="text-gray-500 hover:text-gray-700"><FaCog className="h-5 w-5" /></button>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimesCircle className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {loading ? (
                    <p className="text-gray-600">Loading group chat...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : messages.length > 0 ? (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender_id === 1} /> // Placeholder for isOwnMessage
                    ))
                ) : (
                    <p className="text-gray-600">No messages yet. Start the group conversation!</p>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                        type="text"
                        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newMessage.trim()}
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GroupChat;
