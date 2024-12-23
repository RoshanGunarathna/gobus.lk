import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && allowedRoles.includes(user.role) ? children : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
