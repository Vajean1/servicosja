const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthData = () => {
    const stored = localStorage.getItem('auth');
    try {
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
};

const setAuthData = (data) => {
    localStorage.setItem('auth', JSON.stringify(data));
};

const clearAuthData = () => {
    localStorage.removeItem('auth');
};

const refreshToken = async () => {
    const authData = getAuthData();
    if (!authData || !authData.refresh) {
        throw new Error("No refresh token available");
    }

    try {
        const response = await fetch(`${API_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: authData.refresh })
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        const newAuthData = {
            ...authData,
            access: data.access,
            refresh: data.refresh || authData.refresh
        };

        setAuthData(newAuthData);
        return newAuthData.access;

    } catch (error) {
        console.error("Failed to refresh token", error);
        clearAuthData();
        window.location.href = '/';
        throw error;
    }
};

export const apiRequest = async (endpoint, options = {}) => {
    const authData = getAuthData();
    let token = authData ? authData.access : null;

    const headers = { ...options.headers };

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    let url = endpoint;
    if (!endpoint.startsWith('http')) {
        url = `${API_URL}${endpoint}`;
    }

    let response = await fetch(url, config);

    if (response.status === 401) {
        if (!endpoint.includes('auth/token/refresh') && !endpoint.includes('auth/token/login')) {
            try {
                token = await refreshToken();
                config.headers['Authorization'] = `Bearer ${token}`;
                response = await fetch(url, config);
            } catch (refreshError) {
                throw refreshError;
            }
        }
    }

    if (!response.ok) {
        let errorResult;
        try {
            errorResult = await response.json();
        } catch (e) {
            errorResult = { message: response.statusText, status: response.status };
        }
        throw errorResult;
    }

    if (response.status === 204) {
        return null;
    }

    try {
        const result = await response.json();
        return result;
    } catch (e) {
        return null;
    }
};
