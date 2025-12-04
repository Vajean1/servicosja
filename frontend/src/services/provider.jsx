import { useState, useCallback } from "react";

export default function ProviderServices() {
    const [loading, setLoading] = useState(false);
    const [providers, setPoviders] = useState([]);
    const [refetchProviders, setRefetchProviders] = useState(true);
    const [providerAccount, setProviderAccount] = useState([])
    const url = '/api';

    const register = (formData) => {
        setLoading(true);
        return new Promise((resolve, reject) => { 
            fetch(`${url}/accounts/registro/prestador/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                const result = await response.json(); 
                if (!response.ok) {
                    reject(result); 
                } else {
                    resolve(result); 
                }
            })
            .catch((error) => {
                console.log('Erro na requisição ou validação:', error);
                throw error;
            })
            .finally(() => {
                setLoading(false);
                console.log('finalizado');
            });
        });
    };

     const login = async (formData) => {
        setLoading(true);

        try {
            const response = await fetch(`${url}/auth/token/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json(); 
            console.log("Resposta da API:", result);

          

            return result; 

        } catch (error) {
            console.error(' Erro na requisição ou validação:', error);
            throw error; 
        } finally {
            setLoading(false);
            console.log('finalizado');
        }
    };

    // Função para buscar TODOS os provedores (usada no carregamento inicial e reset)
    const getProviders = useCallback(() => {
        setLoading(true)
        fetch(`${url}/accounts/prestadores/`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json()) 
        .then((result) => {
            setPoviders(result)
            console.log('todos')
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
            setRefetchProviders(false) // Desativa o flag após a busca
        })
    }, [url, setLoading, setPoviders, setRefetchProviders])

    // Função para buscar um único perfil
    const getProviderPerfil = useCallback(( id) => {
        setLoading(true)
        return fetch(`${url}/accounts/prestadores/${id}/`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then((response) => response.json()) 
        .then((result) => {
            setProviderAccount(result)
            console.log(result)
            return result;
        })
        .catch((error)=> {
            console.log(error)
            throw error;
        })
        .finally(() => {
            setLoading(false)
            
        })
    }, [url, setLoading, setProviderAccount])

    const getFilteredProviders = useCallback(async ({ material, hours24, weekend, service, category, minRating, orderByDistance, orderByRating, latitude, longitude }) => {
        setLoading(true);
        const params = [];
        
        if (material !== null) {
            params.push(`possui_material_proprio=${material}`);
        }
        if (hours24 !== null) {
            params.push(`disponibilidade=${hours24}`);
        }
        if (weekend !== null) {
            params.push(`atende_fim_de_semana=${weekend}`);
        }
        if (service) {
            params.push(`servico=${service}`);
        }
        if (category) {
            params.push(`categoria=${category}`);
        }
        if (minRating) {
            params.push(`nota_minima=${minRating}`);
        }
        if (orderByRating) {
            params.push(`melhor_avaliado=true`);
        }
        if (orderByDistance && latitude && longitude) {
            params.push(`ordenar_por_distancia=true`);
            params.push(`latitude=${latitude}`);
            params.push(`longitude=${longitude}`);
        }

        const queryString = params.length > 0 ? '?' + params.join('&') : '';
        
        try {
            const response = await fetch(`${url}/accounts/prestadores/${queryString}`, {
                method:'GET',
                headers:{ 'Content-Type': 'application/json' },
            });
            let result = await response.json(); 

            // Client-side filtering for minRating if backend returns unfiltered list
            if (minRating) {
                 result = result.filter(p => (p.nota_media || 0) >= minRating);
            }

            setPoviders(result);
            console.log(`Filtro(s) aplicado(s) na URL: ${queryString}`);
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [url, setLoading, setPoviders]);

    const getBestRatedProviders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/accounts/prestadores/?melhor_avaliado=true`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Erro ao buscar prestadores:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [url]);

    const getReviews = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/avaliacoes/listar/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();
            
            return result.avaliacoes || [];
        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [url]);

    const getProviderSolicitations = async () => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/contratacoes/prestador/solicitacoes/`, {
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
            console.error("Error getting provider solicitations:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const completeService = async (id) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/contratacoes/solicitacoes/${id}/concluir/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        } catch (error) {
            console.error("Error completing service:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addPortfolioItem = async (formData) => {
        setLoading(true);
        try {
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            // No Content-Type header for FormData, browser sets it with boundary
            const response = await fetch(`${url}/portfolio/itens/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (!response.ok) throw result;
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
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/portfolio/itens/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                 // Try to parse error if content exists, otherwise throw status
                 try {
                    const result = await response.json();
                    throw result;
                 } catch (e) {
                    throw new Error(`Delete failed with status: ${response.status}`);
                 }
            }
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
            const storedAuth = localStorage.getItem('auth');
            const token = storedAuth ? JSON.parse(storedAuth).access : null;
            if (!token) throw new Error("No token found");

            const response = await fetch(`${url}/accounts/perfil/prestador/editar/`, {
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
            console.error("Error updating provider profile:", error);
            throw error;
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
        // Novo método unificado de filtro:
        getFilteredProviders,
        getBestRatedProviders,
        getReviews,
        getProviderSolicitations,
        completeService,
        addPortfolioItem,
        deletePortfolioItem,
        updateProviderProfile
    };
}
