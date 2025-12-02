// services/user.js (UserServices)

import { useCallback, useState } from "react";


export default function UserServices() {
    const [loading, setLoading] = useState(false);
    const [providerAccount, setProviderAccount] = useState([])
    const url = '/api';

    

    const register = (formData) => {
        setLoading(true);
        return new Promise((resolve, reject) => { 
            fetch(`${url}/accounts/registro/cliente/`, {
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
            .then((result) => {
                if (result) {
               
                    console.log(result);
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



     const getUserPerfil = useCallback(( id) => {
            setLoading(true)
            fetch(`${url}/accounts/me/`, {
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
            })
            .catch((error)=> {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
                
            })
        }, [url, setLoading, setProviderAccount ])
    
    return{register , loading , getUserPerfil ,providerAccount}
}