import { useState, useCallback } from "react";
import { apiRequest } from "./api";

export default function ProviderServices() {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [providers, setPoviders] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [refetchProviders, setRefetchProviders] = useState(true);
    const [providerAccount, setProviderAccount] = useState([]);

    const register = (formData) => {
        setLoading(true);
        // Retaining Promise wrapper to match existing signature if expected, or simplifying to async/await
        // Existing code returns a Promise. apiRequest returns a Promise.
        return apiRequest('/accounts/registro/prestador/', {
            method: 'POST',
            body: JSON.stringify(formData)
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const login = async (formData) => {
        setLoading(true);
        try {
            const result = await apiRequest('/auth/token/login/', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            return result;
        } catch (error) {
            console.error('Erro na requisição ou validação:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getProviders = useCallback(() => {
        setLoading(true);
        apiRequest('/accounts/prestadores/', {
            method: 'GET'
        })
        .then((result) => {
            const providersList = result.results || result;
            setPoviders(providersList);
            setNextPage(result.next || null);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
            setRefetchProviders(false);
        });
    }, [setLoading, setPoviders, setRefetchProviders]);

    const getProviderPerfil = useCallback((id) => {
        setLoading(true);
        return apiRequest(`/accounts/prestadores/${id}/`, {
            method: 'GET'
        })
        .then((result) => {
            setProviderAccount(result);
            return result;
        })
        .catch((error) => {
            console.error(error);
            throw error;
        })
        .finally(() => {
            setLoading(false);
        });
    }, [setLoading, setProviderAccount]);

    const getFilteredProviders = useCallback(async ({ material, hours24, weekend, service, category, minRating, orderByDistance, orderByRating, latitude, longitude }) => {
        setLoading(true);
        const params = [];

        if (material !== null) params.push(`possui_material_proprio=${material}`);
        if (hours24 !== null) params.push(`disponibilidade=${hours24}`);
        if (weekend !== null) params.push(`atende_fim_de_semana=${weekend}`);
        if (service) params.push(`servico=${service}`);
        if (category) params.push(`categoria=${category}`);
        if (minRating) params.push(`nota_minima=${minRating}`);
        if (orderByRating) params.push(`melhor_avaliado=true`);
        if (orderByDistance && latitude && longitude) {
            params.push(`ordenar_por_distancia=true`);
            params.push(`latitude=${latitude}`);
            params.push(`longitude=${longitude}`);
        }

        const queryString = params.length > 0 ? '?' + params.join('&') : '';

        try {
            const result = await apiRequest(`/accounts/prestadores/${queryString}`, {
                method: 'GET'
            });

            let providersList = result.results || result;

            if (minRating) {
                 providersList = providersList.filter(p => (p.nota_media || 0) >= minRating);
            }

            setPoviders(providersList);
            setNextPage(result.next || null);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setPoviders]);

    const getBestRatedProviders = useCallback(async () => {
        setLoading(true);
        try {
            const result = await apiRequest('/accounts/prestadores/?melhor_avaliado=true', {
                method: 'GET'
            });
            return result.results || result;
        } catch (error) {
            console.error("Erro ao buscar prestadores:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getReviews = useCallback(async () => {
        setLoading(true);
        try {
            const result = await apiRequest('/avaliacoes/listar/', {
                method: 'GET'
            });
            return result.results || result.avaliacoes || [];
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getProviderSolicitations = async () => {
        setLoading(true);
        try {
            const result = await apiRequest('/contratacoes/prestador/solicitacoes/', {
                method: 'GET'
            });
            return result.results || result;
        } catch (error) {
            console.error("Error getting provider solicitations:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const completeService = async (id) => {
        setLoading(true);
        try {
            const result = await apiRequest(`/contratacoes/solicitacoes/${id}/concluir/`, {
                method: 'POST'
            });
            return result;
        } catch (error) {
            console.error("Error completing service:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const markServiceAsNotRealized = async (id) => {
        setLoading(true);
        try {
            const result = await apiRequest(`/contratacoes/solicitacoes/${id}/nao-realizado/`, {
                method: 'POST'
            });
            return result;
        } catch (error) {
            console.error("Error marking service as not realized:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addPortfolioItem = async (formData) => {
        setLoading(true);
        try {
            // apiRequest handles Content-Type for FormData automatically (removes it so browser sets boundary)
            const result = await apiRequest('/portfolio/itens/', {
                method: 'POST',
                body: formData
            });
            return result;
        } catch (error) {
            console.error("Error adding portfolio item:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deletePortfolioItem = async (id) => {
        setLoading(true);
        try {
            // apiRequest handles 204/empty response by returning null
            await apiRequest(`/portfolio/itens/${id}/`, {
                method: 'DELETE'
            });
            return true;
        } catch (error) {
            console.error("Error deleting portfolio item:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProviderProfile = async (formData) => {
        setLoading(true);
        try {
            const result = await apiRequest('/accounts/perfil/prestador/editar/', {
                method: 'PATCH',
                body: formData
            });
            return result;
        } catch (error) {
            console.error("Error updating provider profile:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loadMoreProviders = useCallback(async () => {
        if (!nextPage) return;
        setLoadingMore(true);
        try {
            let fetchUrl = nextPage;
            if (fetchUrl.startsWith('http://127.0.0.1:8000')) {
                fetchUrl = fetchUrl.replace('http://127.0.0.1:8000', 'https://back-end-servicosja-api.onrender.com');
            } else if (fetchUrl.startsWith('http://localhost:8000')) {
                fetchUrl = fetchUrl.replace('http://localhost:8000', 'https://back-end-servicosja-api.onrender.com');
            }

            // Using apiRequest with full URL
            const result = await apiRequest(fetchUrl, {
                method: 'GET'
            });

            const newProviders = result.results || result;

            setPoviders(prev => [...prev, ...newProviders]);
            setNextPage(result.next || null);
        } catch(error) {
            console.error("Error loading more providers:", error);
        } finally {
            setLoadingMore(false);
        }
    }, [nextPage, setLoadingMore, setPoviders, setNextPage]);

    const getProviderByUserId = async (userId) => {
        setLoading(true);
        try {
            const data = await apiRequest('/accounts/prestadores/', {
                method: 'GET'
            });
            const providers = data.results || data;

            const found = providers.find(p => p.user_id == userId || p.user == userId);

            if (found) {
                return found;
            } else {
                try {
                    const profileCheck = await apiRequest(`/accounts/prestadores/${userId}/`, { method: 'GET' });
                    if (profileCheck) {
                        return profileCheck;
                    }
                } catch (e) {
                }

                console.warn(`Provider with user_id ${userId} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error searching provider by user ID:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        loading,
        getProviders,
        providers,
        refetchProviders,
        setRefetchProviders,
        login,
        getProviderPerfil,
        providerAccount,
        getFilteredProviders,
        getBestRatedProviders,
        getReviews,
        getProviderSolicitations,
        completeService,
        markServiceAsNotRealized,
        addPortfolioItem,
        deletePortfolioItem,
        updateProviderProfile,
        getProviderByUserId,
        nextPage,
        loadMoreProviders,
        loadingMore
    };
}
