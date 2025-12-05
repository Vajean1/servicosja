import { useState, useCallback } from "react";

export default function CategoryServices() {
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const url = import.meta.env.VITE_API_URL || '/api';

    const getCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const response = await fetch(`${url}/servicos/categorias/?include_servicos=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const result = await response.json();
            setCategories(result);
            return result;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        } finally {
            setLoadingCategories(false);
        }
    }, [url]);

    return {
        loadingCategories,
        categories,
        getCategories
    };
}
