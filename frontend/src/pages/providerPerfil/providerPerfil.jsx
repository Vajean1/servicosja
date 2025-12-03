import React, { useState, useEffect, useMemo } from 'react';
import styles from './providerPerfil.module.css';
import ProviderServices from '../../services/provider';
import { useNavigate } from 'react-router';
import RatingChart from './RatingChart'; 
import { FaEdit, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { FaCheckDouble , FaX  } from "react-icons/fa6";
import { useAuth } from '../../context/AuthContext';
import EditProviderModal from '../../components/editProviderModal/EditProviderModal';
import { green } from '@mui/material/colors';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `https://back-end-servicosja-api.onrender.com${url}`;
};

const mockUserData = {
    nome: "Eduardo Jesen",
    cargo: "Designer Gráfico",
    dataNasc: "17/09/1997",
    genero: "Masculino",
    telefone: "(81) 99966-6600",
    dataRegistro: "28/11/2025",
    email: "eduardojesen@example.com",
    linkedIn: "user2025",
    perfilImg: "/img/exemples/Group 8.png",
    mensagens: [
        { nome: "João Victor", data: "28/11" },
        { nome: "Maria Silva", data: "27/11" },
        { nome: "Pedro Lima", data: "26/11" },
    ],
    galeria: [
        "../assets/img/imagemServico1.png",
        "../assets/img/imagemServico2.png",
        "../assets/img/imagemServico3.png",
        "../assets/img/imagemServico4.png",
    ],
    avaliacoes: [
        { estrelas: 5, percentual: 82, quantidade: 0 },
        { estrelas: 4, percentual: 10, quantidade: 0 },
        { estrelas: 3, percentual: 4, quantidade: 0 },
        { estrelas: 2, percentual: 2, quantidade: 0 },
        { estrelas: 1, percentual: 2, quantidade: 0 },
    ]
};

const TABS = {
    DASHBOARD: 'Dashboard',
    MESSAGES: 'Mensagens'
};

// --- Componente Gallery (Modificado com Exclusão) ---
const Gallery = ({ images, onImageSelect, onImageUpload, onImageDelete, selectedImage }) => {
    return (
        <div className={styles.galleryContainer}>
            <div className={styles.mainImageContainer}>
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt="Imagem em destaque do prestador"
                        className={styles.mainImage}
                    />
                ) : (
                    <div className={styles.emptyMainImage}>
                        Adicione e selecione uma imagem para ver em destaque.
                    </div>
                )}
            </div>

            <div className={styles.thumbnailsContainer}>
                <label htmlFor="file-upload" className={styles.addThumbnail}>
                    <span role="img" aria-label="Adicionar Foto">➕</span> Adicionar Foto
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    style={{ display: 'none' }}
                />

                {images.map((item, index) => (
                    <div
                        key={item.id}
                        className={`${styles.thumbnail} ${item.url === selectedImage ? styles.activeThumbnail : ''}`}
                        onClick={() => onImageSelect(item.url)}
                    >
                        <img src={item.url} alt={`Miniatura ${index + 1}`} />
                        {/* Botão de Excluir - Apenas mostra se não for temp */}
                        {!item.isTemp && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(window.confirm('Tem certeza que deseja excluir esta imagem?')) {
                                        onImageDelete(item.id);
                                    }
                                }}
                                className={styles.deleteButton}
                                title="Excluir imagem"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function ProviderPerfil({ userData = mockUserData }) {
    const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [solicitations, setSolicitations] = useState([]);

    const getTabClassName = (tab) => {
        return `${styles.tab} ${activeTab === tab ? styles.active : ''}`;
    };

    // --- Lógica de Limpeza de URL Object (Não alterado) ---
    useEffect(() => {
        return () => {
            userGalleryImages.forEach(item => {
                if (item.url && item.url.startsWith('blob:')) {
                    URL.revokeObjectURL(item.url);
                }
            });
        };
    }, []); 

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const tempId = Date.now();
            const tempUrl = URL.createObjectURL(file);
            const tempItem = { id: tempId, url: tempUrl, isTemp: true };

            setUserGalleryImages(prevImages => [...prevImages, tempItem]);
            setCurrentMainImage(tempUrl);

            try {

                const formData = new FormData();
                formData.append('imagem', file);
                
                const result = await addPortfolioItem(formData);
                console.log("Upload Result:", result);
                
                const finalUrl = getImageUrl(result.imagem || result.image || result.url);

                setUserGalleryImages(prevImages => 
                    prevImages.map(item => item.id === tempId ? { id: result.id, url: finalUrl } : item)
                );
                setCurrentMainImage(current => current === tempUrl ? finalUrl : current);
                
                URL.revokeObjectURL(tempUrl);

                alert("Imagem salva com sucesso!");
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
                alert("Erro ao enviar imagem. O preview será removido.");
                
                setUserGalleryImages(prevImages => prevImages.filter(item => item.id !== tempId));
                if (currentMainImage === tempUrl) {
                    setCurrentMainImage(null);
                }
                URL.revokeObjectURL(tempUrl);
            }
        }
        event.target.value = null;
    };
    
    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
    };
    
    const {
        getProviderPerfil, 
        providerAccount,
        getProviderSolicitations,
        completeService,
        addPortfolioItem,
        deletePortfolioItem
    } = ProviderServices()
    
    const handleDeleteImage = async (id) => {
        try {
            await deletePortfolioItem(id);
            setUserGalleryImages(prev => prev.filter(item => item.id !== id));
            
            if (currentMainImage === userGalleryImages.find(item => item.id === id)?.url) {
                const remaining = userGalleryImages.filter(item => item.id !== id);
                if (remaining.length > 0) {
                    setCurrentMainImage(remaining[0].url);
                } else {
                    setCurrentMainImage(null);
                }
            }
            alert("Imagem removida com sucesso!"); //Colocar um pop legalzin
        } catch (error) {
            console.error("Erro ao deletar imagem:", error);
            alert("Erro ao remover imagem. Tente novamente.");
        }
    };
    
    const { user, logout, loading } = useAuth();
    const profileId = user?.profile_id; 

    const navigate = useNavigate()

    useEffect(() => {
        // If not loading and no user or profileId, redirect to login
        if (!loading && !profileId) {
             // Maybe user is not a provider or not logged in
             navigate('/login');
        } 
    }, [profileId, loading, navigate]); 

    // 2. Chamada da API
    useEffect(()=>{
        if (profileId) {
            getProviderPerfil(profileId);
            getProviderSolicitations()
                .then(data => setSolicitations(data))
                .catch(err => console.error(err));
        }
    },[profileId]) 
    
    
    useEffect(() => {
        if (providerAccount?.localizacao) {
            const locationQuery = providerAccount.localizacao;
            console.log(`Dados de localização carregados: ${locationQuery}. Nenhuma ação de mapa está sendo executada.`);
        }
        
        // Popula galeria com dados da API
        if (providerAccount?.portfolio && Array.isArray(providerAccount.portfolio)) {
            const formattedImages = providerAccount.portfolio.map(item => ({
                id: item.id,
                url: getImageUrl(item.imagem)
            }));
            setUserGalleryImages(formattedImages);
            if (formattedImages.length > 0) {
                setCurrentMainImage(formattedImages[0].url);
            }
        }
    }, [providerAccount]);
    // --------------------------------------------------------------------
    
    const comentarios = providerAccount.ultimas_avaliacoes
    const estatisticas = providerAccount.estatisticas
    
    // --- Lógica de Transformação de Dados do Gráfico ---
    const transformedRatings = useMemo(() => {
        if (!estatisticas || !estatisticas.distribuicao) {
            return userData.avaliacoes; 
        }

        const distribuicao = estatisticas.distribuicao;
        const keys = Object.keys(distribuicao); 
        
        const newRatings = keys.map(key => {
            const starNumber = parseInt(key.split('_')[1], 10);
            const data = distribuicao[key];

            return {
                estrelas: starNumber,
                percentual: data.porcentagem,
                quantidade: data.quantidade,
            };
        });

        newRatings.sort((a, b) => b.estrelas - a.estrelas);
        return newRatings;
    }, [estatisticas, userData.avaliacoes]); 

    const notaMedia = providerAccount?.nota_media || providerAccount?.estatisticas?.media_geral || 0;

    const renderStars = (currentRating) => {
        const fullStars = Math.round(currentRating);
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} style={{ color: i < fullStars ? '#ffc107' : '#e4e5e9', fontSize: '24px' }}>★</span>
            );
        }
        return stars;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdateProfile = () => {
        if (profileId) {
            getProviderPerfil(profileId); // Refresh data
        }
    };
    
    const handleCompleteService = async (id) => {
        if (window.confirm("Deseja marcar este serviço como concluído? Isso enviará uma mensagem para o cliente.")) {
            try {
                const result = await completeService(id);
                console.log("Resultado da conclusão:", result);
                
                // Check for whatsapp_url (used in other parts) or whatsapp_link (docs)
                const link = result.whatsapp_url || result.whatsapp_link;

                setSolicitations(prev => prev.map(s => s.id === id ? { ...s, servico_realizado: true } : s));
                
                if (link) {
                    window.open(link, '_blank');
                } else {
                    console.warn("Link do WhatsApp não retornado pela API", result);
                    alert("Serviço marcado como concluído! (Link do WhatsApp não recebido)");
                }
            } catch (error) {
                console.error("Erro ao concluir serviço:", error);
                alert("Erro ao concluir serviço.");
            }
        }
    };

    return (
        <div className={styles.dashboardPage}>
            <header className={styles.header}>
                <div className={styles.perfil}>
                    <div className={styles.imgEdit} onClick={() => setOpenEditModal(true)}>
                        <img 
                            src={getImageUrl(providerAccount?.foto || providerAccount?.foto_perfil) || userData.perfilImg} 
                            alt="perfil" 
                        />
                        <FaEdit />
                    </div>
                    <div>
                        <h2>{providerAccount?.nome?.toUpperCase()}</h2>
                        <p>{providerAccount?.servico?.nome}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem', marginLeft: 'auto', padding: '0 20px' }}>
                    <FaSignOutAlt /> Sair
                </button>
            </header>

            <div className={styles.container}>
                
                {/* 1. Informações Pessoais */}
                <div className={styles.box}>
                    <h2>Informações Pessoais</h2>
                    <div className={styles.iconEdit} onClick={() => setOpenEditModal(true)}>
                        <FaEdit />
                    </div>
                    <div className={styles.descricaoGrid}>
                        <span>Nome: {providerAccount?.nome}</span>
                        <span>Data de Nasc: {providerAccount?.data_nascimento}</span>
                        <span>Gênero: {providerAccount?.genero }</span>
                        <span>Telefone: {providerAccount?.telefone_publico}</span>
                        <span>Cargo: {providerAccount?.servico?.nome}</span>
                        <span>Data de Registro: {providerAccount?.data_registro}</span>
                        <span>Email: {providerAccount?.email}</span>
                        <span>Disponibilidade: {providerAccount?.disponibilidade === true ? "Disponivel final de semana" : "Indisponivel final de semana"}</span>
                        <span>Cidade: {providerAccount?.cidade}</span>
                        <span>Bairro: {providerAccount?.bairro}</span>

                         <div className={styles.box2}>
                            <h2>Descrição</h2>

                            <textarea placeholder='Bibiografia' value={providerAccount?.biografia || ''} readOnly>
                            </textarea>
                        </div>
                    </div>
                </div>

                <div className={styles.box}>
                    <h2>Solicitações de serviços</h2>

                    <div className={styles.solicitMain }>
                        <h5>Nome do cliente</h5>
                        <h5>Data</h5>
                        <h5>Realizou o serviço?</h5>
                        
                        
                    </div>

                    {solicitations.length === 0 ? (
                        <div className={styles.solicit} style={{justifyContent: 'center'}}>
                            <p>Nenhuma solicitação encontrada.</p>
                        </div>
                    ) : (
                        solicitations.map((sol) => (
                            <div key={sol.id} className={styles.solicit}>
                                <h5>{sol.cliente_nome || sol.cliente || "Cliente"}</h5>
                                <h5>{sol.data_solicitacao ? new Date(sol.data_solicitacao).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</h5>
                                <div>
                                    {sol.servico_realizado ? (
                                        <FaCheckDouble style={{color:'green' , fontSize:'22px'}} title="Serviço Realizado" />
                                    ) : (
                                        <FaCheckDouble 
                                            style={{color:'gray', fontSize:'22px', cursor:'pointer'}} 
                                            onClick={() => handleCompleteService(sol.id)}
                                            title="Marcar como realizado"
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

               

                {/* 2. Mensagens e Galeria */}
                <div className={`${styles.flex} ${styles.colum}`}>
                    <div className={`${styles.box} ${styles.mensagens}`}> 
                        <h2>Últimas Avaliações</h2>
                        <div className={`${styles.flex} ${styles.flexBox}`}>
                            <h5>Nome</h5>
                            <h5>Data</h5>
                        </div>
                            {comentarios?.map((msg, index) => (
                               <div className={styles.commentsBox} key={index}>
                                    <div className={styles.w_50}>{msg.cliente_nome}</div>
                                    <div className={styles.w_50}>{msg.data}</div>
                                    <div className={styles.line}>{msg.comentario}</div>
                               </div>
                            ))}
                    </div>
                
                    <div className={styles.w_50}>
                       <Gallery
                            images={userGalleryImages }
                            onImageSelect={handleImageSelect}
                            onImageUpload={handleImageUpload}
                            onImageDelete={handleDeleteImage}
                            selectedImage={currentMainImage}
                        /> 
                    </div>
                </div>

                {/* 3. Gráfico de Avaliações (AreaChart) */}
                <div className={`${styles.box} ${styles.avaliacoesBox}`}>
                    <h2>Avaliação Geral</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a06c9' }}>
                            {Number(notaMedia).toFixed(1)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex' }}>
                                {renderStars(notaMedia)}
                            </div>
                            <span style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                Baseado nas avaliações
                            </span>
                        </div>
                    </div>

                    <h2>Distribuição de Avaliações</h2>
                    
                    {estatisticas?.distribuicao && (
                        <RatingChart distribuicao={estatisticas.distribuicao} />
                    )}
                </div>

                {/* 4. BLOCO DO MAPA (AGORA APENAS INFORMAÇÃO DE LOCALIZAÇÃO) */}
               
            </div>

            <EditProviderModal 
                open={openEditModal} 
                close={() => setOpenEditModal(false)} 
                providerData={providerAccount} 
                onUpdate={handleUpdateProfile} 
            />
        </div>
    );
}
