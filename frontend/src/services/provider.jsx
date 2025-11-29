import { useState } from "react";

export default function ProviderServices() {
    const [loading, setLoading] = useState(false);
    const [providers, setPoviders] = useState([]);
    const [refetchProviders, setRefetchProviders] = useState(true);
    const url = '/api';

    const register = (formData) => {
        setLoading(true);
        // Retorna uma Promise para que o componente possa lidar com sucesso/erro
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
                // Tenta ler o corpo como JSON
                const result = await response.json(); 

                if (!response.ok) {
                    // Se a resposta não for 2xx (status de erro), rejeita com o corpo da resposta (erros)
                    reject(result); 
                } else {
                    // Se for 2xx, resolve com o resultado (sucesso)
                    resolve(result); 
                }
            })
            .then((result) => {
                if (result) {
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ token: result.access, user: result.nome_completo })
                    );
                    console.log(result);
                }
            })
            .catch((error) => {
                // O erro de rejeição (JSON com os erros) será tratado aqui
                console.log('Erro na requisição ou validação:', error);
                throw error; // Propaga o erro para o .catch() do componente
            })
            .finally(() => {
                setLoading(false);
                console.log('finalizado');
            });
        });
    };

       const getProviders = () => {
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
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
            setRefetchProviders(false)
        })
    }


    const findmaterial = (response) => {
         setLoading(true)
        fetch(`${url}/accounts/prestadores/?possui_material_proprio=${response}`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
        })
        .then((response) => response.json()) 
        .then((result) => {
            
            setPoviders(result)
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
            
        })
    }

    const find24h = (hora) => {
           setLoading(true)
        fetch(`${url}/accounts/prestadores/?disponibilidade=${hora}`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
        })
        .then((response) => response.json()) 
        .then((result) => {
            
            setPoviders(result)
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
            
        })
    }

    const findWeekend = (response) => {
           setLoading(true)
        fetch(`${url}/accounts/prestadores/?atende_fim_de_semana=${response}`, {
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
        })
        .then((response) => response.json()) 
        .then((result) => {
            
            setPoviders(result)
        })
        .catch((error)=> {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
            
        })
    }

   return { register, loading, getProviders, providers, refetchProviders, findmaterial, find24h, setRefetchProviders, findWeekend };
}

