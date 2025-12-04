// services/user.js (UserServices)

import { useState } from "react";

export default function UserServices() {
    const [loading, setLoading] = useState(false);
    const url = '/api';

    const register = (formData) => {
        setLoading(true);
        
        // Retorna a Promise do fetch. Não precisamos de um 'new Promise' wrapper.
        // O componente UserRegistration lidará com o .then e .catch.
        return fetch(`${url}/accounts/registro/cliente/`, { // 👈 Retorna o fetch diretamente
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Geralmente, 'Access-Control-Allow-Origin' é um header de resposta
                // do servidor, não do cliente. Removi-o, mas se for necessário
                // por algum motivo no seu ambiente, você pode mantê-lo.
            },
            body: JSON.stringify(formData)
        })
        .then(async (response) => {
            const result = await response.json(); 

            if (!response.ok) {
                // Lança um erro para cair no .catch seguinte
                throw result; 
            }
            
            // Retorna o resultado de sucesso
            return result; 
        })
        .catch((error) => {
            // Este catch lida com erros de rede ou o erro 'result' lançado acima
            console.error('Erro na requisição ou validação:', error);
            // Re-lança o erro para o componente poder capturá-lo no seu .catch
            throw error; 
        })
        .finally(() => {
            setLoading(false);
            console.log('finalizado');
        });
    };

    const getMe = async () => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;

            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/accounts/me/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const initiateContact = async (providerUserId, serviceId) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            
            if (!token) throw new Error("User not authenticated");

            const payload = {
                prestador_id: providerUserId,
                servico: serviceId
            };
            console.log("Initiating Contact Payload:", payload);

            const response = await fetch(`${url}/contratacoes/iniciar/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                console.error("API Error Detail:", result);
                throw result;
            }
            return result;
        } catch (error) {
            console.error("Error initiating contact:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (data) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const isFormData = data instanceof FormData;
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${url}/accounts/me/`, {
                method: 'PATCH',
                headers: headers,
                body: isFormData ? data : JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getClientSolicitations = async () => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/contratacoes/cliente/solicitacoes/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error getting client solicitations:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createReview = async (data) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/avaliacoes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateClientProfile = async (formData) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");
            
            const response = await fetch(`${url}/accounts/perfil/cliente/editar/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error updating client profile:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserReviews = async () => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/avaliacoes/listar/?minhas=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error getting user reviews:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (providerId) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/accounts/favoritos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prestador_id: providerId })
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error toggling favorite:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getFavorites = async () => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/accounts/favoritos/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error getting favorites:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    return { 
        register, 
        loading, 
        getMe, 
        initiateContact, 
        updateUser, 
        getClientSolicitations, 
        createReview,
        updateClientProfile,
        getUserReviews,
        toggleFavorite,
        getFavorites
    };
}
