import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLogin } from 'context/LoginContext';

const ProtectedRoute: React.FC = () => {
    const { user_id } = useLogin();

    //If not logged in --> go to /login
    if (!user_id) return <Navigate to="/login" replace />;

    //Render child routes
    return <Outlet />;
};

export default ProtectedRoute;
