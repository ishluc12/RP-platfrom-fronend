import React from 'react';

const Notification = ({ message, type }) => {
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-800';

    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            break;
        case 'info':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            break;
        default:
            break;
    }

    return (
        <div className={`p-3 rounded-md shadow-sm ${bgColor} ${textColor}`}>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default Notification;
