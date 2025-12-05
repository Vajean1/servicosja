import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUserFromStorage = () => {
            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
                try {
                    const parsedAuth = JSON.parse(storedAuth);
                    if (parsedAuth.access || parsedAuth.token) {
                        setUser(parsedAuth);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error("Error parsing auth from local storage", error);
                    localStorage.removeItem('auth');
                }
            }
            setLoading(false);
        };
        loadUserFromStorage();
    }, []);

    const login = async (email, password) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${baseUrl}/auth/token/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            localStorage.setItem('auth', JSON.stringify(data));
            setUser(data);
            setIsAuthenticated(true);
            return data;

        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth');
        setUser(null);
        setIsAuthenticated(false);
    };

    const setAuthData = (data) => {
        localStorage.setItem('auth', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        setAuthData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
