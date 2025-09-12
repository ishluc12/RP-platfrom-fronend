import React, { useState, useEffect, useRef } from 'react';
import messageService from '../../../services/shared/messageService';
import { FaPaperPlane, FaTimesCircle } from 'react-icons/fa';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ conversationId, conversationType, recipient, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (conversationId) {
            fetchMessages();
        }
    }, [conversationId, conversationType]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (conversationType === 'direct') {
                response = await messageService.getConversationThread(conversationId);
            } else if (conversationType === 'group') {
                response = await messageService.getGroupMessages(conversationId);
            }
            setMessages(response.data || response);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError('Failed to load messages.');
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
                is_group: conversationType === 'group',
            };

            if (conversationType === 'direct') {
                messageData.receiver_id = conversationId; // For direct, conversationId is recipient ID
            } else if (conversationType === 'group') {
                messageData.group_id = conversationId;
            }

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

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chat to start messaging.
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 bg-white border-l border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">{recipient?.name || 'Chat'}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <FaTimesCircle className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {loading ? (
                    <p className="text-gray-600">Loading messages...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : messages.length > 0 ? (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender_id === 1} /> // Placeholder for isOwnMessage
                    ))
                ) : (
                    <p className="text-gray-600">No messages yet. Start the conversation!</p>
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

export default ChatWindow;
