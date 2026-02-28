'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('efv_auth_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setTimeout(() => setUser(parsed), 0);
            } catch (err) {
                console.error('Error parsing stored user', err);
            }
        }
        setTimeout(() => setLoading(false), 0);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://efv-b.onrender.com';
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            setUser(data);
            localStorage.setItem('efv_auth_user', JSON.stringify(data));
        } catch (err) {
            throw new Error('Invalid credentials');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('efv_auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
