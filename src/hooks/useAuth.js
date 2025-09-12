import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const { user, isAuthenticated, login, logout } = useContext(AuthContext);
    return { user, isAuthenticated, login, logout };
};

export default useAuth;
