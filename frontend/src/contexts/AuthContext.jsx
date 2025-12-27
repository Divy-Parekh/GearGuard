import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.data.user);
        return response.data.data.user;
    };

    const register = async (data) => {
        const response = await api.post('/auth/register', data);
        setUser(response.data.data.user);
        return response.data.data.user;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    const forgotPassword = async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    };

    const hasRole = (...roles) => {
        return user && roles.includes(user.role);
    };

    const isAdmin = () => hasRole('ADMIN');
    const isManager = () => hasRole('MANAGER', 'ADMIN');
    const isTechnician = () => hasRole('TECHNICIAN', 'MANAGER', 'ADMIN');

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        hasRole,
        isAdmin,
        isManager,
        isTechnician,
        refreshUser: fetchUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
