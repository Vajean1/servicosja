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

            const response = await fetch(`${url}/accounts/me/`, {
                method: 'PATCH',
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
            console.error("Error updating user:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    return{register , loading, getMe, initiateContact, updateUser}
}
