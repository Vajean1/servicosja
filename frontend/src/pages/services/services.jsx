import React, { useEffect, useState, useCallback } from 'react';
import ProviderBox from '../../components/providerBox/providerBox';
import styles from './services.module.css'
import { FaSearch ,FaStar } from "react-icons/fa";
import ProviderServices from '../../services/provider';
import CategoryServices from '../../services/categories';
import Loading from '../loading/loading';
import { useProviderContext } from '../../context/providerSelected';
import Loading2 from '../loading/loading2';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    if (url.startsWith('/img') || url.startsWith('/assets')) return url;
    return `https://back-end-servicosja-api.onrender.com${url}`;
};

export default function Services () {
    const [activeMenuId, setActiveMenuId] = useState(null);

    const { getCategories, categories } = CategoryServices();

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const activeMenuItem = categories.find(item => item.id === activeMenuId);

    // Agora usa getFilteredProviders
    const { getProviders, providers, refetchProviders, loading, setRefetchProviders, getFilteredProviders } = ProviderServices()
    const { setProviderSelected } = useProviderContext();


    // Inicia com 'null' para indicar que o filtro não está aplicado
    const [findMat , setFindMat] = useState(null)
    const [hora , setHora] = useState(null)
    const [fds,setFds] = useState(null)
    const [selectedService, setSelectedService] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Proximity Filter States
    const [orderByDistance, setOrderByDistance] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });


    const handleProviderSelected = useCallback((provider) =>{
        setProviderSelected(provider)
    }, [setProviderSelected]) 
    
    // Handlers que mudam o estado para true/false, disparando o useEffect unificado
    const handleChangeMaterial = (event) => {
        // Se marcado, é true. Se desmarcado, é null (filtro removido).
        setFindMat(event.target.checked ? true : null); 
    };

    const handleChangehora = (event) => {
        setHora(event.target.checked ? true : null); 
    };

    const handleChangeWeekend = (event) => {
        setFds(event.target.checked ? true : null); 
    };

    const handleChangeProximity = (event) => {
        if (event.target.checked) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                        setOrderByDistance(true);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
                        // Uncheck the box visually if possible, or just fail silently regarding state update
                    }
                );
            } else {
                alert("Geolocalização não é suportada pelo seu navegador.");
            }
        } else {
            setOrderByDistance(null);
            setUserLocation({ lat: null, lng: null });
        }
    };

    // Handler para "Todos" (Resetar filtros)
    const handleChangeTodos =() => {
        // Zera os filtros
        setFindMat(null);
        setHora(null);
        setFds(null);
        setSelectedService(null);
        setSelectedRating(null);
        setOrderByDistance(null);
        setUserLocation({ lat: null, lng: null });
        // Força o getProviders (buscar todos sem filtro)
        setRefetchProviders(true); 
    }

    const handleServiceClick = (e, serviceId) => {
        e.preventDefault();
        setSelectedService(serviceId);
        setActiveMenuId(null);
    };

    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
    };

    // Efeito para Carregamento Inicial (Mantido)
    useEffect (()=>{
        if(refetchProviders){
            getProviders()
            console.log('Disparando chamada inicial de TODOS')
        }
    },[refetchProviders, getProviders]) 

    // Efeito UNIFICADO para FILTROS: Roda apenas quando um dos estados de filtro muda
    useEffect(() => {
        // Se refetchProviders for true, significa que estamos no carregamento inicial ou resetando para TODOS, então evitamos filtros concorrentes.
        if (refetchProviders) return; 

        // Se pelo menos um filtro foi ativado (não é null), disparamos a busca combinada
        if (findMat !== null || hora !== null || fds !== null || selectedService !== null || selectedRating !== null || orderByDistance !== null) {
            // Se for por distância, precisamos garantir que temos lat/lng
            if (orderByDistance && (!userLocation.lat || !userLocation.lng)) {
                return; // Aguarda a geolocalização completar
            }

            getFilteredProviders({
                material: findMat,
                hours24: hora,
                weekend: fds,
                service: selectedService,
                minRating: selectedRating,
                orderByDistance: orderByDistance,
                latitude: userLocation.lat,
                longitude: userLocation.lng
            });
            console.log('Filtro(s) aplicado(s)')
        } else {
             // Se todos os filtros estão null, mas refetchProviders é false, forçamos o getProviders
             // para garantir que todos sejam exibidos após a remoção de um filtro.
             getProviders();
             console.log('Todos os filtros removidos. Buscando todos novamente.')
        }

    }, [findMat, hora, fds, selectedService, selectedRating, orderByDistance, userLocation, getFilteredProviders, refetchProviders, getProviders]); 

    // Filtragem local case-insensitive pelo nome
    const displayedProviders = providers.filter(provider => 
        provider.nome && provider.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <div className={styles.services}>
            
            <div 
                className={styles.menuWrapper} 
                onMouseLeave={() => setActiveMenuId(null)} 
            >
                
                <div className={styles.servicesMenu}>
                    {categories.map((item) => (
                        <div   key={item.id}  className={styles.menuItem} onMouseEnter={() => setActiveMenuId(item.id)} >
                            <a id={item.id} href="#">{item.nome} </a>
                        </div>
                    ))} 
                </div>

                
                {activeMenuItem && (
                    <div className={styles.menuFilter}>
                             {activeMenuItem.servicos.map((service) => (
                                <a  key={service.id} href="#" onClick={(e) => handleServiceClick(e, service.id)}>
                                    {service.nome}
                                </a>
                        ))}
                    </div>
                )}
            </div>
            
            <div className={styles.servicesBody}>
                
                <div className={styles.servicesFilter}>
                    <div className={styles.filterItem}>
                        <input 
                            type="text" 
                            placeholder="Buscar por nome..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button><FaSearch /></button>
                    </div>

                    <div className={styles.serviceClassific}>
                        <h4>Filtrar por:</h4>

                        <div className={styles.serviceClassificBox}>
                            <h2>Classificação de Profissionais</h2>
                            <div className={styles.starSponsored}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar 
                                        key={star} 
                                        color={star <= (selectedRating || 0) ? "#ffcd29" : "#e4e5e9"} 
                                        onClick={() => handleRatingClick(star)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                        {/* Checkbox "Todos" - Marcado apenas se nenhum filtro estiver ativo */}
                        <div className={styles.serviceItem}>
                            <input 
                                onChange={handleChangeTodos} 
                                type="checkbox" 
                                checked={findMat === null && hora === null && fds === null && selectedService === null && selectedRating === null && orderByDistance === null}
                            />
                            <span >Todos</span>
                        </div>
                    <div className={styles.servicesList}>
                        <h3>Filtros</h3>
                        <div className={styles.serviceItem}>
                            <input checked={orderByDistance === true} onChange={handleChangeProximity} type="checkbox" />
                            <span>Mais Próximos</span>
                        </div>

                        <h3>Material Próprio</h3>
                        <div className={styles.serviceItem}>
                            {/* checked={findMat === true} verifica se o filtro TRUE está ativo */}
                            <input checked={findMat === true} onChange={handleChangeMaterial} type="checkbox" />
                            <span >Possui Material</span>
                        </div>
                        
                    </div>

                    
                    <div className={styles.servicesList}>
                        <h3>Disponibilidade</h3>
                        <div className={styles.serviceItem}>
                            {/* Correção: Passa o handler diretamente */}
                            <input  checked={hora === true} onChange={handleChangehora} type="checkbox" />
                            <span>Atende 24h</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <input checked={fds === true} onChange={handleChangeWeekend} type="checkbox" />
                            <span>Atende fim de semana</span>
                        </div>
                    </div>
                </div>

                <section className={styles.providerContainer}>

                    {loading && (
                    <Loading2/>
                    )}

                    {displayedProviders.map((provider)=> (
                        <div className={styles.box} onClick={() => {handleProviderSelected(provider)}} key={provider.id}>
                            <ProviderBox 
                                name={provider.nome} 
                                location={`${provider.cidade}, ${provider.bairro}`} 
                                rating={provider.nota_media} 
                                resum={'Trancista. Especialista em tranças e penteados afro. Atendimento em domicílio.'} 
                                image={getImageUrl(provider.foto || provider.foto_perfil)}
                                key={provider.id} 
                            />
                        </div>
                    ))}
                    
                </section>
            </div>
        </div>
    )
}
