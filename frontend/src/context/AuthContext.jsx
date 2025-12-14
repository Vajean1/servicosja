import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
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
        setLoading2(true)
        try {
            const data = await apiRequest('/auth/token/login/', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            localStorage.setItem('auth', JSON.stringify(data));
            setUser(data);
            setIsAuthenticated(true);
            return data;

        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }finally{
            setLoading2(false)
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
        loading2,
        logout,
        setAuthData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
