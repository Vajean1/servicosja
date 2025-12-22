import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './providerPerfil.module.css';
import ProviderServices from '../../services/provider';
import UserServices from '../../services/user';
import { useNavigate } from 'react-router';
import RatingChart from './RatingChart';
import { FaEdit, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { FaCheckDouble , FaX } from "react-icons/fa6";
import { useAuth } from '../../context/AuthContext';
import EditProviderModal from '../../components/editProviderModal/EditProviderModal';
import ImageCropModal from '../../utils/ImageCropModal';
import Loading2 from '../loading/loading2';

const getImageUrl = (url) => {
    if (!url) return '';


    if (url.startsWith('http://127.0.0.1:8000')) {
        return url.replace('http://127.0.0.1:8000', 'https://back-end-servicosja-api.onrender.com');
    }
    if (url.startsWith('http://localhost:8000')) {
         return url.replace('http://localhost:8000', 'https://back-end-servicosja-api.onrender.com');
    }

    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `https://back-end-servicosja-api.onrender.com${url}`;
};

const mockUserData = {

};

const TABS = {
    DASHBOARD: 'Dashboard',
    MESSAGES: 'Mensagens'
};

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

const getFirstTwoNames = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ').slice(0, 2).join(' ');
};

export default function ProviderPerfil({ userData = mockUserData }) {
    const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [solicitations, setSolicitations] = useState([]);
    const [providerAccount, setProviderAccount] = useState({});

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [openCropModal, setOpenCropModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);


    const getTabClassName = (tab) => {
        return `${styles.tab} ${activeTab === tab ? styles.active : ''}`;
    };

    const { getMe } = UserServices();

    const {
        getProviderPerfil,
        getProviderSolicitations,
        completeService,
        markServiceAsNotRealized,
        addPortfolioItem,
        deletePortfolioItem,
        updateProviderProfile
    } = ProviderServices()

    const { user, logout, loading } = useAuth();
    const profileId = user?.profile_id;
    const navigate = useNavigate()

    useEffect(() => {
        console.log("DEBUG: Solicitations State", solicitations);
    }, [solicitations]);

    useEffect(() => {
        return () => {
            userGalleryImages.forEach(item => {
                if (item.url && item.url.startsWith('blob:')) {
                    URL.revokeObjectURL(item.url);
                }
            });
             if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [userGalleryImages, previewUrl]);

    useEffect(() => {
        if (!loading && !profileId) {
             navigate('/login');
        }
    }, [profileId, loading, navigate]);

    // 2. Função de Recarregar Perfil
    const handleUpdateProfile = useCallback(async () => {
        if (profileId) {
            try {
                const [meData, providerData] = await Promise.all([
                    getMe(),
                    getProviderPerfil(profileId)
                ]);

                // Extrai dados aninhados do perfil (prestador ou cliente)
                const nestedProfile = meData.perfil_prestador || meData.perfil_cliente || {};

                // Remove campos que não queremos sobrescrever (IDs) para manter os objetos completos do providerData
                const { servico, categoria, ...nestedProfileFiltered } = nestedProfile;


                const mappedMeData = {
                    ...meData,
                    ...nestedProfileFiltered, // Achata os dados aninhados, exceto servico/categoria
                    data_nascimento: meData.dt_nascimento || meData.data_nascimento,
                    // Garante prioridade para campos da raiz se existirem
                    genero: meData.genero,
                    email: meData.email,
                };

                const finalData = { ...providerData, ...mappedMeData };
                setProviderAccount(finalData);
            } catch (error) {
                console.error(error);
            }

            getProviderSolicitations()
                .then(data => setSolicitations(data))
                .catch(err => console.error(err));
        }
    }, [profileId, getProviderPerfil]);

    // 3. Executa o Carregamento Inicial (Chama APENAS quando profileId muda)
    useEffect(()=>{

        if (profileId) {
             handleUpdateProfile();
        }
    },[profileId, handleUpdateProfile]) // A dependência handleUpdateProfile é estável devido ao useCallback


    useEffect(() => {
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


    const handlePhotoEditClick = () => {
        document.getElementById('profile-photo-upload').click();
    };

    const handlePhotoChangeForCrop = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setImageToCrop(url);
            setOpenCropModal(true);
            e.target.value = null;
        }
    };

    const onCropComplete = async (croppedImageBlob) => {
        setOpenCropModal(false);
        setImageToCrop(null);
        setActionLoading(true);

        if (previewUrl) {
             URL.revokeObjectURL(previewUrl);
        }

        const newPreviewUrl = URL.createObjectURL(croppedImageBlob);
        setPreviewUrl(newPreviewUrl);
        setSelectedPhoto(croppedImageBlob);

        try {
            const photoFormData = new FormData();
            photoFormData.append('foto_perfil', croppedImageBlob, 'profile_cropped.jpg');

            await updateProviderProfile(photoFormData);
            handleUpdateProfile();
            setSelectedPhoto(null);
            alert("Foto de perfil atualizada com sucesso!");
        } catch (error) {
            console.error("Failed to update profile photo", error);
            alert("Erro ao atualizar a foto de perfil.");
            setPreviewUrl(null);
            setSelectedPhoto(null);
        } finally {
            setActionLoading(false);
        }
    }

    const handleCloseCropModal = useCallback(() => {
        setOpenCropModal(false);
        setImageToCrop(null);
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
             const tempId = Date.now();
             const tempUrl = URL.createObjectURL(file);
             const tempItem = { id: tempId, url: tempUrl, isTemp: true };

             setUserGalleryImages(prevImages => [...prevImages, tempItem]);
             setCurrentMainImage(tempUrl);
             setActionLoading(true);

             try {
                 const formData = new FormData();
                 formData.append('imagem', file);

                 const result = await addPortfolioItem(formData);

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
             } finally {
                 setActionLoading(false);
             }
        }
         event.target.value = null;
    };

    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
    };

    const handleDeleteImage = async (id) => {
         setActionLoading(true);
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
             alert("Imagem removida com sucesso!");
         } catch (error) {
             console.error("Erro ao deletar imagem:", error);
             alert("Erro ao remover imagem. Tente novamente.");
         } finally {
             setActionLoading(false);
         }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCompleteService = async (id) => {
        if (window.confirm("Deseja marcar este serviço como concluído? Isso enviará uma mensagem para o cliente.")) {
             try {
                 const result = await completeService(id);

                 const link = result.whatsapp_url || result.whatsapp_link;

                 setSolicitations(prev => prev.map(s => s.id === id ? { ...s, servico_realizado: true, data_conclusao: new Date().toISOString() } : s));

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

    const handleMarkNotRealized = async (id) => {
        if (window.confirm("Tem certeza que deseja marcar este serviço como NÃO realizado? O cliente não poderá avaliar.")) {
            try {
                await markServiceAsNotRealized(id);
                setSolicitations(prev => prev.map(s => s.id === id ? { ...s, servico_realizado: false, data_conclusao: new Date().toISOString() } : s));
                alert("Serviço marcado como não realizado.");
                // Atualizar o perfil para pegar o novo contador, se necessário
                handleUpdateProfile();
            } catch (error) {
                console.error("Erro ao marcar serviço como não realizado:", error);
                alert("Erro ao marcar serviço como não realizado.");
            }
        }
    };

    const comentarios = providerAccount?.ultimas_avaliacoes
    const estatisticas = providerAccount?.estatisticas

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


    return (
        <div className={styles.dashboardPage}>

            {actionLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Loading2 />
                </div>
            )}

            {/* Input de arquivo escondido para a foto de perfil */}
            <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChangeForCrop}
                style={{ display: 'none' }}
            />

            <header className={styles.header}>
                <div className={styles.perfil}>
                    <div className={styles.imgEdit} onClick={handlePhotoEditClick}>
                        <img
                            src={getImageUrl(providerAccount?.foto || providerAccount?.foto_perfil) || userData.perfilImg || 'img/exemples/Group 8.png' }
                            alt="perfil"
                        />
                        <FaEdit />
                    </div>
                    <div>
                        <h2>{getFirstTwoNames(providerAccount?.nome)?.toUpperCase()}</h2>
                        <p>{providerAccount?.servico?.nome}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem', marginLeft: 'auto', padding: '0 20px' , position: 'absolute' , top: '30px' , right:'5px'}}>
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
                        <span>Disponibilidade: {providerAccount?.disponibilidade === true ? "Disponivel 24h" : "Indisponivel 24h"}</span>
                        <span>Cidade: {providerAccount?.cidade}</span>
                        <span>Bairro: {providerAccount?.bairro}</span>
                        {providerAccount?.servicos_nao_realizados_cache > 0 && (
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                Serviços não entregues: {providerAccount.servicos_nao_realizados_cache}
                            </span>
                        )}

                        <div className={styles.box2}>
                            <h2>Descrição</h2>

                            <textarea placeholder='Biografia' value={providerAccount?.biografia || ''} readOnly>
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
                                <h5 className={styles.soli}>{sol.cliente_nome || sol.cliente || "Cliente"}</h5>
                                <h5 className={styles.soli}>{sol.data_clique ? new Date(sol.data_clique).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</h5>
                                <div className={styles.soli}>
                                    {/* Lógica de Status:
                                        1. Concluído (Realizado): data_conclusao != null && servico_realizado == true
                                        2. Não Realizado (Cancelado): data_conclusao != null && servico_realizado == false
                                        3. Pendente: data_conclusao == null
                                    */}
                                    {sol.data_conclusao ? (
                                        sol.servico_realizado ? (
                                            <FaCheckDouble style={{color:'green' , fontSize:'22px'}} title="Serviço Realizado" />
                                        ) : (
                                            <FaX style={{color:'red' , fontSize:'22px'}} title="Serviço Não Realizado" />
                                        )
                                    ) : (
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <FaCheckDouble
                                                style={{color:'gray', fontSize:'22px', cursor:'pointer'}}
                                                onClick={() => handleCompleteService(sol.id)}
                                                title="Marcar como realizado"
                                            />
                                            <FaX
                                                style={{color:'gray', fontSize:'20px', cursor:'pointer'}}
                                                onClick={() => handleMarkNotRealized(sol.id)}
                                                title="Não realizou o serviço"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className={`${styles.flex} ${styles.colum}`}>
                    <div className={`${styles.box} ${styles.mensagens}`}>
                        <h2>Últimas Avaliações</h2>
                        <div className={`${styles.flex} ${styles.flexBox}`}>
                            <h5>Nome</h5>
                            <h5>Data</h5>
                        </div>
                            {comentarios?.map((msg, index) => (
                               <div className={styles.commentsBox} key={index}>
                                    <div className={styles.commentHeader}>
                                        <div >{msg.cliente_nome}</div>
                                        <div >{msg.data}</div>
                                    </div>
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


            </div>

            {/* Modal de Edição de Dados Textuais (EditProviderModal) */}
            <EditProviderModal
                open={openEditModal}
                close={() => setOpenEditModal(false)}
                providerData={providerAccount}
                onUpdate={handleUpdateProfile}
            />

            {/* Modal de Corte de Imagem (ImageCropModal) */}
            {openCropModal && imageToCrop && (
                <ImageCropModal
                    image={imageToCrop}
                    onCropComplete={onCropComplete}
                    onClose={handleCloseCropModal}
                />
            )}
        </div>
    );
}
