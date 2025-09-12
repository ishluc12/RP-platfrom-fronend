import React, { createContext, useState } from 'react';

export const RoleContext = createContext(null);

const RoleProvider = ({ children }) => {
    const [role, setRole] = useState('student'); // Default role

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export default RoleProvider;
