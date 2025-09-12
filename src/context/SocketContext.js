import React, { createContext } from 'react';
import useSocket from '../hooks/useSocket';

export const SocketContext = createContext(null);

const SocketProvider = ({ children, url }) => {
    const socket = useSocket(url);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
