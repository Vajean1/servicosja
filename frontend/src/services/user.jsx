import { useState } from "react";
import { apiRequest } from "./api";

export default function UserServices() {
    const [loading, setLoading] = useState(false);

    const register = async (formData) => {
        setLoading(true);
        try {
            const result = await apiRequest('/accounts/registro/cliente/', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            return result;
        } catch (error) {
            console.error('Erro na requisição ou validação:', error);
            throw error;
        } finally {
            setLoading(false);
            console.log('finalizado');
        }
    };

    const getMe = async () => {
        setLoading(true);
        try {
            const result = await apiRequest('/accounts/me/', {
                method: 'GET'
            });
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
            const payload = {
                prestador_id: providerUserId,
                servico: serviceId
            };
            console.log("Initiating Contact Payload:", payload);

            const result = await apiRequest('/contratacoes/iniciar/', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
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
            const isFormData = data instanceof FormData;
            const result = await apiRequest('/accounts/me/', {
                method: 'PATCH',
                body: isFormData ? data : JSON.stringify(data)
            });
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
            const result = await apiRequest('/contratacoes/cliente/solicitacoes/', {
                method: 'GET'
            });
            return result.results || result;
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
            const result = await apiRequest('/avaliacoes/', {
                method: 'POST',
                body: JSON.stringify(data)
            });
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
            const result = await apiRequest('/accounts/perfil/cliente/editar/', {
                method: 'PATCH',
                body: formData
            });
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
            const result = await apiRequest('/avaliacoes/listar/?minhas=true', {
                method: 'GET'
            });
            return result.results || result;
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
            const result = await apiRequest('/accounts/favoritos/', {
                method: 'POST',
                body: JSON.stringify({ prestador_id: providerId })
            });
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
            const result = await apiRequest('/accounts/favoritos/', {
                method: 'GET'
            });
            return result.results || result;
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
