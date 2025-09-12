import { useState, useEffect } from 'react';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info') => {
        setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return { notifications, addNotification, removeNotification };
};

export default useNotifications;
