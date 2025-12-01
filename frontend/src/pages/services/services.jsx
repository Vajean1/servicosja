import React, { useEffect, useState, useCallback } from 'react';
import ProviderBox from '../../components/providerBox/providerBox';
import styles from './services.module.css'
import { FaSearch ,FaStar } from "react-icons/fa";
import ProviderServices from '../../services/provider';
import Loading from '../loading/loading';
import { useProviderContext } from '../../context/providerSelected';
import Loading2 from '../loading/loading2';

export default function Services () {
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Definição de menuData (mantida)
    const menuData = [
    { 
        id: 'beleza', 
        label: 'Beleza e Bem-estar', 
        subItems: [
    "Alongamento de unha",
    "Depilador/Epilador(a)",
    "Manicure/Pedicure",
    "Alongamento de cílios",
    "Especialista em megahair",
    "Massagista",
    "Barbeiro(a)",
    "Micropigmentador(a)",
    "Cabelereiro(a)",
    "Especialista em penteados",
    "Podólogo",
    "Colourista",
    "Esteticista",
    "Trancista",
    "Designer de sobrancelhas",
    "Lash designer",
    "Visagista",
    "Maquiador(a)"
]
    },
    { 
        id: 'cuidado', 
        label: 'Cuidado Pessoal', 
        subItems: [
    "Acupunturista",
    "Fisioterapeuta domiciliar",
    "Aromaterapeuta",
    "Personal trainer",
    "Auriculoterapeuta",
    "Quiropraxista",
    "Cuidador(a) de idosos",
    "Ventosaterapeuta",
    "Enfermeiro(a) particular"
] 
    },
    { 
        id: 'lazer', 
        label: 'Lazer e Eventos', 
        subItems:[
    "Aluguel de brinquedos",
    "Decorador de festas",
    "Aluguel de equi. eletrônicos",
    "DJ/Músico",
    "Fotógrafo",
    "Aluguel de mesas e cadeiras",
    "Garçom/Barman",
    "Aluguel de fantasias",
    "Montador de eventos",
    "Animador/palhaço",
    "Sonoplastia/Téc. de som",
    "Buffet"
]
    },
    { 
        id: 'limpeza', 
        label: 'Limpeza e Organização', 
        subItems: [
    "Dedetizador",
    "Limpeza de estofados e colchões",
    "Diarista",
    "Enceramento de pisos",
    "Limpeza pós-obra",
    "Limpeza de ar-condicionado",
    "Limpeza de telhado",
    "Limpeza de caixa d'água",
    "Limpeza de vidro",
    "Limpeza de carpete",
    "Tratamento de pragas",
    "Zelador"
]
    },
    { 
        id: 'manutencao', 
        label: 'Manutenção e Reparos', 
        subItems: [
    "Borracheiro",
    "Eletricista",
    "Instalação de bomba e caixa d'água",
    "Chaveiro",
    "Encanador",
    "Conserto de armários",
    "Envernizador de móveis",
    "Manutenção de ventilador",
    "Conserto de eletrodomésticos",
    "Instalação de ar-condicionado",
    "Marceneiro",
    "Mecânico",
    "Conserto de fogões e fornos",
    "Instalação de câmeras",
    "Montador de móveis",
    "Instalação de TV e Home theater",
    "Pintor",
    "Conserto de máquina de lavar",
    "Téc. em refrigeração",
    "Vedação"
]
    },
    { 
        id: 'reforma', 
        label: 'Reforma e Construção', 
        subItems: [
    "Aplicação de massa corrida",
    "Instalação de bancadas e pias",
    "Azulejista",
    "Instalação de Drywall",
    "Calheiro",
    "Instalação de portas e janelas",
    "Colocação de forro de PVC",
    "Instalação de telhados",
    "Fundação e alvenaria",
    "Pedreiro",
    "Gesseiro",
    "Reforma de fachadas",
    "Impermeabilização de lajes e paredes",
    "Reforma de pisos"
]
    },
    { 
        id: 'solucoes', 
        label: 'Soluções Profissionais', 
        subItems: [
    "Consultor de marketing",
    "Professor profisional",
    "Designer Gráfico",
    "Redator/Tradutor",
    "Editor de vídeo",
    "Téc. de informática e celular",
    "Social media",
    "Web designer",
    "Ilustrador digital"
]
    },
    { 
        id: 'transporte', 
        label: 'Transporte', 
        subItems:[
    "Aluguel de caminhão",
    "Moto-boy",
    "Aluguel de carro/van",
    "Mudança comercial",
    "Frete",
    "Mudança residencial",
    "Guincho",
    "Transporte de animais"
]
    },
    ];

    const activeMenuItem = menuData.find(item => item.id === activeMenuId);

    // Agora usa getFilteredProviders
    const { getProviders, providers, refetchProviders, loading, setRefetchProviders, getFilteredProviders } = ProviderServices()
    const { setProviderSelected } = useProviderContext();


    // Inicia com 'null' para indicar que o filtro não está aplicado
    const [findMat , setFindMat] = useState(null)
    const [hora , setHora] = useState(null)
    const [fds,setFds] = useState(null)


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

    // Handler para "Todos" (Resetar filtros)
    const handleChangeTodos =() => {
        // Zera os filtros
        setFindMat(null);
        setHora(null);
        setFds(null);
        // Força o getProviders (buscar todos sem filtro)
        setRefetchProviders(true); 
    }

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
        if (findMat !== null || hora !== null || fds !== null) {
            getFilteredProviders({
                material: findMat,
                hours24: hora,
                weekend: fds
            });
            console.log('Filtro(s) aplicado(s)')
        } else {
             // Se todos os filtros estão null, mas refetchProviders é false, forçamos o getProviders
             // para garantir que todos sejam exibidos após a remoção de um filtro.
             getProviders();
             console.log('Todos os filtros removidos. Buscando todos novamente.')
        }

    }, [findMat, hora, fds, getFilteredProviders, refetchProviders, getProviders]); 

        

    return(
        <div className={styles.services}>
            
            <div 
                className={styles.menuWrapper} 
                onMouseLeave={() => setActiveMenuId(null)} 
            >
                
                <div className={styles.servicesMenu}>
                    {menuData.map((item) => (
                        <div   key={item.id}  className={styles.menuItem} onMouseEnter={() => setActiveMenuId(item.id)} >
                            <a id={item.id} href="#">{item.label} </a>
                        </div>
                    ))} 
                </div>

                
                {activeMenuItem && (
                    <div className={styles.menuFilter}>
                             {activeMenuItem.subItems.map((subItem) => (
                                <a  key={`${activeMenuItem.id}-${subItem}`} href="#" >
                                    {subItem}
                                </a>
                        ))}
                    </div>
                )}
            </div>
            
            <div className={styles.servicesBody}>
                
                <div className={styles.servicesFilter}>
                    <div className={styles.filterItem}><input type="text" /><button><FaSearch /></button></div>

                    <div className={styles.serviceClassific}>
                        <h4>Filtrar por:</h4>

                        <div className={styles.serviceClassificBox}>
                            <h2>Classificação de Profissionais</h2>
                            <div className={styles.starSponsored}>
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                        </div>
                    </div>

                        {/* Checkbox "Todos" - Marcado apenas se nenhum filtro estiver ativo */}
                        <div className={styles.serviceItem}>
                            <input 
                                onChange={handleChangeTodos} 
                                type="checkbox" 
                                checked={findMat === null && hora === null && fds === null}
                            />
                            <span >Todos</span>
                        </div>
                    <div className={styles.servicesList}>
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

                    {providers.map((provider)=> (
                        <div className={styles.box} onClick={() => {handleProviderSelected(provider)}} key={provider.id}>
                            <ProviderBox name={provider.nome}  location={`${provider.cidade}, ${provider.bairro}`} rating={4.9} resum={'Trancista. Especialista em tranças e penteados afro. Atendimento em domicílio.'} key={provider.id} />
                        </div>
                    ))}
                    
                </section>
            </div>
        </div>
    )
}