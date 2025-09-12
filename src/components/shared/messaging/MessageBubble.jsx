import React from 'react';

const MessageBubble = ({ message, isOwnMessage }) => {
    const messageClass = isOwnMessage
        ? "bg-blue-600 text-white rounded-bl-lg rounded-t-lg ml-auto"
        : "bg-gray-300 text-gray-800 rounded-br-lg rounded-t-lg mr-auto";
    const alignmentClass = isOwnMessage ? "justify-end" : "justify-start";

    return (
        <div className={`flex ${alignmentClass} mb-2`}>
            <div className={`max-w-xs px-4 py-2 shadow ${messageClass}`}>
                <p className="text-sm">{message.message}</p>
                <span className="block text-xs opacity-80 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;
