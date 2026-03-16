import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('task_manager_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const users = await api.getUsers();
            const foundUser = users.find(u => u.email === email);

            if (foundUser) {
                // In a real app, you'd verify the password with the backend
                // For this demo, we'll assume any password works if the user exists
                // or you can add a simple check if password field exists in user object
                if (foundUser.password && foundUser.password !== password) {
                    return { success: false, message: 'Invalid password' };
                }

                setUser(foundUser);
                localStorage.setItem('task_manager_user', JSON.stringify(foundUser));
                return { success: true, user: foundUser };
            }
            return { success: false, message: 'User not found' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server error' };
        }
    };

    const register = async (userData) => {
        try {
            const newUser = await api.registerUser({
                ...userData,
                role: userData.role || 'user',
                id: Date.now().toString()
            });
            setUser(newUser);
            localStorage.setItem('task_manager_user', JSON.stringify(newUser));
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('task_manager_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin', loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
