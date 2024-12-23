import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Show loading spinner during persistence check
    return user ? children : <Navigate to="/login" />;
};

export default AuthRoute;
