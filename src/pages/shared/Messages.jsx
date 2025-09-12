import React from 'react';
import ChatList from '../../components/shared/messaging/ChatList';
import ChatWindow from '../../components/shared/messaging/ChatWindow';

const Messages = () => {
    return (
        <div>
            <h1>Messages Page</h1>
            <ChatList />
            <ChatWindow />
        </div>
    );
};

export default Messages;
