import React, { useEffect, useState, useCallback, useRef } from 'react';
import ProviderBox from '../../components/providerBox/providerBox';
import styles from './services.module.css'
import { FaSearch ,FaStar ,FaFilter  } from "react-icons/fa";
import ProviderServices from '../../services/provider';
import CategoryServices from '../../services/categories';
import Loading from '../loading/loading';
import { useProviderContext } from '../../context/providerSelected';
import Loading3 from '../loading/loading3';
import { ImMenu3 } from "react-icons/im";

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    if (url.startsWith('/img') || url.startsWith('/assets')) return url;
    return `https://back-end-servicosja-api.onrender.com${url}`;
};

export default function Services () {
    const [activeMenuId, setActiveMenuId] = useState(null);
    
    // ESTADOS ADICIONADOS
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // NOVO ESTADO PARA O FILTRO MÓVEL
    
    // REF: Para detectar cliques fora do componente
    const servicesRef = useRef(null); 
    
    // HANDLERS ATUALIZADOS/NOVOS
    const handleToggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
        setActiveMenuId(null); 
        setIsFilterMenuOpen(false); // Garante que o menu de Filtro feche
    };

    const handleToggleFilterMenu = () => {
        setIsFilterMenuOpen(prev => !prev);
        setIsMobileMenuOpen(false); // Garante que o menu de Serviços feche
        setActiveMenuId(null); // Fecha o submenu desktop
    };
    

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
    const [orderByRating, setOrderByRating] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });


    const handleProviderSelected = useCallback((provider) =>{
        setProviderSelected(provider)
    }, [setProviderSelected]) 
    
    // Handlers que mudam o estado para true/false, disparando o useEffect unificado
    const handleChangeMaterial = (event) => {
        // Se marcado, é true. Se desmarcado, é null (filtro removido).
        setFindMat(event.target.checked ? true : null); 
        // Fecha o menu de filtro móvel após selecionar (opcional, mas melhora UX)
        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
    };

    const handleChangehora = (event) => {
        setHora(event.target.checked ? true : null); 
        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
    };

    const handleChangeWeekend = (event) => {
        setFds(event.target.checked ? true : null); 
        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
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
                        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
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
            if (isFilterMenuOpen) setIsFilterMenuOpen(false);
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
        setOrderByRating(null);
        setUserLocation({ lat: null, lng: null });
        // Força o getProviders (buscar todos sem filtro)
        setRefetchProviders(true); 
        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
    }

    const handleServiceClick = (e, serviceId) => {
        e.preventDefault();
        setSelectedService(serviceId);
        setActiveMenuId(null);
        // Fecha o menu mobile ao selecionar um serviço
        setIsMobileMenuOpen(false);
    };

    const handleRatingClick = (rating) => {
        setSelectedRating(rating);
        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
    };

    // Efeito para Carregamento Inicial (Mantido)
    useEffect (()=>{
        if(refetchProviders){
            getProviders()
        }
    },[refetchProviders, getProviders]) 

    // Efeito UNIFICADO para FILTROS
    useEffect(() => {
        if (refetchProviders) return; 

        if (findMat !== null || hora !== null || fds !== null || selectedService !== null || orderByDistance !== null || orderByRating !== null) {
            if (orderByDistance && (!userLocation.lat || !userLocation.lng)) {
                return; // Aguarda a geolocalização completar
            }

            getFilteredProviders({
                material: findMat,
                hours24: hora,
                weekend: fds,
                service: selectedService,
                orderByDistance: orderByDistance,
                orderByRating: orderByRating,
                latitude: userLocation.lat,
                longitude: userLocation.lng
            });
        } else {
             getProviders();
        }

    }, [findMat, hora, fds, selectedService, orderByDistance, orderByRating, userLocation, getFilteredProviders, refetchProviders, getProviders]); 

    // EFEITO: Fecha os menus (mobile e desktop) ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Se o clique não foi dentro da div principal .services (que inclui ambos os menus)
            if (servicesRef.current && !servicesRef.current.contains(event.target)) {
                // Fecha o menu móvel de serviços
                if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                }
                // Fecha o menu de sub-categorias desktop
                if (activeMenuId !== null) {
                    setActiveMenuId(null);
                }
                // Fecha o menu de filtro móvel
                if (isFilterMenuOpen) {
                    setIsFilterMenuOpen(false);
                }
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen, activeMenuId, isFilterMenuOpen]); 


    // Filtragem local (Nome) e Ordenação por Rating
    const displayedProviders = providers
        .filter(provider => {
            if (!searchTerm) return true;
            
            const term = searchTerm.toLowerCase();
            let serviceName = "";

            if (provider.servico && typeof provider.servico === 'object' && provider.servico.nome) {
                serviceName = provider.servico.nome;
            } else if (typeof provider.servico === 'string') {
                serviceName = provider.servico;
            } else if (typeof provider.servico === 'number') {
                for (const cat of categories) {
                    if (cat.servicos) {
                        const found = cat.servicos.find(s => s.id === provider.servico);
                        if (found) {
                            serviceName = found.nome;
                            break;
                        }
                    }
                }
            }

            return serviceName && serviceName.toLowerCase().includes(term);
        })
        .sort((a, b) => {
            if (selectedRating !== null) {
                // Ordena por proximidade da nota selecionada
                const distA = Math.abs((a.nota_media || 0) - selectedRating);
                const distB = Math.abs((b.nota_media || 0) - selectedRating);
                
                // Se a distância for a mesma, o de maior nota vem primeiro (ex: 4.0 empata com 4.0, depois 4.1 vs 3.9)
                if (distA === distB) {
                    return (b.nota_media || 0) - (a.nota_media || 0);
                }
                return distA - distB; // Menor distância primeiro
            }
            return 0; // Mantém ordem original se nenhuma estrela selecionada
        });

    return(
        // Adicionado o REF na div principal
        <div className={styles.services} ref={servicesRef}>
            
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
                    <div className={styles.menuFilter} >
                             {activeMenuItem.servicos.map((service) => (
                                <a  key={service.id} href="#" onClick={(e) => handleServiceClick(e, service.id)}>
                                    {service.nome}
                                </a>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.menuMobile}>

                        {/* ÍCONE MENU SERVIÇOS */}
                        <div className={styles.icon} onClick={handleToggleMobileMenu}><ImMenu3 /></div>
                        
                        {/* ÍCONE MENU FILTRO: Usa handleToggleFilterMenu */}
                        <div className={styles.iconT} onClick={handleToggleFilterMenu}><FaFilter /></div>
                <div className={styles.filterItemMenu}> 
                        <input 
                            type="text" 
                            placeholder="Buscar por serviço..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button><FaSearch /></button>
                    </div>
            </div>

            {/* Menu Mobile de Categorias/Serviços */}
            <div className={styles.servicesMenuMobile} style={{ display: isMobileMenuOpen ? 'flex' : 'none' }}>
                    {categories.map((item) => (
                        <div   key={item.id}  className={styles.menuItem} onMouseEnter={() => setActiveMenuId(item.id)} >
                            
                            <a 
                                id={item.id} 
                                href="#"
                                onClick={(e) => {
                                    setActiveMenuId(item.id);
                                    setIsMobileMenuOpen(false); 
                                }}
                            >{item.nome} </a>
                        </div>
                    ))} 
                </div>
            
            <div className={styles.servicesBody}>
                
                {/* FILTRO DESKTOP (MANTIDO) */}
                <div className={styles.servicesFilter}>
                    {/* Input presente no desktop */}
                    <div className={styles.filterItem}>
                        <input 
                            type="text" 
                            placeholder="Buscar por serviço..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button><FaSearch /></button>
                    </div>

                        {/* Conteúdo de filtros (repetido abaixo para o móvel) */}
                    <div className={styles.serviceClassific}>
                        <h4>Filtrar por:</h4>
                        <div className={styles.serviceClassificBox}>
                            <h2>Classificação de Profissionais</h2>
                            <div className={styles.starSponsored}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar 
                                        key={star} 
                                        color={star <= (selectedRating || 0) ? "#ffcd29" : "#7d7d7e"} 
                                        onClick={() => handleRatingClick(star)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                        {/* Checkbox "Todos" - Desktop */}
                        <div className={styles.serviceItem}>
                            <input 
                                onChange={handleChangeTodos} 
                                type="checkbox" 
                                checked={findMat === null && hora === null && fds === null && selectedService === null && selectedRating === null && orderByDistance === null && orderByRating === null}
                            />
                            <span >Todos</span>
                        </div>
                    <div className={styles.servicesList}>
                        <h3>Filtros</h3>
                        <div className={styles.serviceItem}>
                            <input checked={orderByDistance === true} onChange={handleChangeProximity} type="checkbox" />
                            <span>Mais Próximos</span>
                        </div>
                        <div className={styles.serviceItem}>
                            <input checked={orderByRating === true} onChange={(e) => setOrderByRating(e.target.checked ? true : null)} type="checkbox" />
                            <span>Melhores Avaliados</span>
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
              
                {isFilterMenuOpen && (
                    <div className={styles.servicesFilter} style={{ 
                        display: 'flex', 
                        position: 'absolute', 
                        top: '155px', 
                        left: 0, 
                        width: '100%', 
                        /* REMOVIDA A ALTURA FIXA DE 500PX para evitar o espaçamento fixo em branco */
                        zIndex: 100, 
                        backgroundColor: '#fcfcfc', // Para ter um fundo claro
                        overflowY: 'auto'
                    }}>
                        {/* Conteúdo de Filtros Mobile */}
                        
                        <div className={styles.serviceClassific}>
                            <h4>Filtrar por:</h4>
                            <div className={styles.serviceClassificBox}>
                                <h2>Classificação de Profissionais</h2>
                                <div className={styles.starSponsored}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar 
                                            key={star} 
                                            color={star <= (selectedRating || 0) ? "#ffcd29" : "#7d7d7e"} 
                                            onClick={() => handleRatingClick(star)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.serviceItem}>
                            <input 
                                onChange={handleChangeTodos} 
                                type="checkbox" 
                                checked={findMat === null && hora === null && fds === null && selectedService === null && selectedRating === null && orderByDistance === null && orderByRating === null}
                            />
                            <span >Todos</span>
                        </div>
                        <div className={styles.servicesList}>
                            <h3>Filtros</h3>
                            <div className={styles.serviceItem}>
                                <input checked={orderByDistance === true} onChange={handleChangeProximity} type="checkbox" />
                                <span>Mais Próximos</span>
                            </div>
                            <div className={styles.serviceItem}>
                                <input checked={orderByRating === true} onChange={(e) => setOrderByRating(e.target.checked ? true : null)} type="checkbox" />
                                <span>Melhores Avaliados</span>
                            </div>

                            <h3>Material Próprio</h3>
                            <div className={styles.serviceItem}>
                                <input checked={findMat === true} onChange={handleChangeMaterial} type="checkbox" />
                                <span >Possui Material</span>
                            </div>
                            
                        </div>

                        <div className={styles.servicesList}>
                            <h3>Disponibilidade</h3>
                            <div className={styles.serviceItem}>
                                <input checked={hora === true} onChange={handleChangehora} type="checkbox" />
                                <span>Atende 24h</span>
                            </div>
                            <div className={styles.serviceItem}>
                                <input checked={fds === true} onChange={handleChangeWeekend} type="checkbox" />
                                <span>Atende fim de semana</span>
                            </div>
                        </div>
                    </div>
                )}
                {/* FIM FILTRO MOBILE */}

                <section className={loading ? styles.providerContainerLogin : styles.providerContainer}>

                    {loading && (
                    <Loading3/>
                    )}

                    {displayedProviders.map((provider)=> (
                        <div className={styles.box} onClick={() => {handleProviderSelected(provider)}} key={provider.id}>
                            <ProviderBox 
                                name={provider.nome} 
                                location={`${provider.cidade}, ${provider.bairro}`} 
                                rating={provider.nota_media} 
                                resum={provider.biografia || "Sem descrição."} 
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