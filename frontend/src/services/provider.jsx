import { useState, useCallback } from "react";

export default function ProviderServices() {
    const [loading, setLoading] = useState(false);
    const [providers, setPoviders] = useState([]);
    const [refetchProviders, setRefetchProviders] = useState(true);
    const [providerAccount, setProviderAccount] = useState([])
    const url = '/api';

    // Nota: register e login não foram envolvidos em useCallback pois não são usados como dependências em outros useEffects aqui.
    const register = (formData) => {
        setLoading(true);
        return new Promise((resolve, reject) => { 
            fetch(`${url}/accounts/registro/prestador/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
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
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
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
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
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

    // NOVO: Função unificada para aplicar múltiplos filtros
    const getFilteredProviders = useCallback(async ({ material, hours24, weekend, service, category, minRating }) => {
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

        const queryString = params.length > 0 ? '?' + params.join('&') : '';
        
        try {
            const response = await fetch(`${url}/accounts/prestadores/${queryString}`, {
                method:'GET',
                headers:{ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            });
            const result = await response.json(); 
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

    const updateProvider = async (data) => {
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

            const response = await fetch(`${url}/accounts/perfil/prestador/editar/`, {
                method: 'PATCH',
                headers: headers,
                body: isFormData ? data : JSON.stringify(data)
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
        updateProvider
    };
}
