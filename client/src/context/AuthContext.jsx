import React, { createContext, useState, useEffect } from 'react';
import { getAccessToken, removeAccessToken } from '../utils/tokenUtils';
import { refreshAccessToken } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User info
    const [loading, setLoading] = useState(true); // To prevent flickering during persistence check

    useEffect(() => {
        const persistAuth = async () => {
            const token = getAccessToken();
            if (token) {
                try {
                    const newToken = await refreshAccessToken();
                    setUser({ accessToken: newToken }); // Set user from refreshed token
                } catch (error) {
                    removeAccessToken();
                }
            }
            setLoading(false); // Mark persistence check complete
        };
        persistAuth();
    }, []);

    const loginUser = (userData) => setUser(userData);
    const logoutUser = () => {
        setUser(null);
        removeAccessToken();
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
