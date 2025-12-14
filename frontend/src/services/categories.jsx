import { useState, useCallback } from "react";
import { apiRequest } from "./api";

export default function CategoryServices() {
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categories, setCategories] = useState([]);

    const getCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const result = await apiRequest('/servicos/categorias/?include_servicos=true', {
                method: 'GET'
            });
            const categoriesList = result.results || result;
            setCategories(categoriesList);
            return categoriesList;
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    return {
        loadingCategories,
        categories,
        getCategories
    };
}
