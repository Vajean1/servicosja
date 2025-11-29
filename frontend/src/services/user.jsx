import { useState } from "react";

export default function UserServices() {
    const [loading, setLoading] = useState(false)
    const url = '/api';

    const register = (formData) => {
        setLoading(true)
        // Retorna uma Promise para que o componente UserRegistration possa lidar com sucesso/erro
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
                    // Se a resposta não for 2xx, rejeita com o corpo da resposta (erros)
                    reject(result); 
                } else {
                    // Se for 2xx, resolve com o resultado (sucesso)
                    resolve(result); 
                }
            })
            .then((result) => {
                // Esta parte é executada se a Promise for resolvida
                console.log(result);
            })
            .catch((error) => {
                // Esta parte captura a rejeição e propaga para o componente
                console.error('Erro na requisição ou validação:', error);
                throw error; // Propaga o erro
            })
            .finally(() => {
                setLoading(false)
                console.log('finalizado')
            });
        });
    }
    
    return{register , loading}
}