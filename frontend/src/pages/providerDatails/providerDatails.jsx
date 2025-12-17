import {useState, useEffect} from 'react';

import styles from './providerDatails.module.css';
import {FaUserCircle, FaHeart, FaRegHeart} from 'react-icons/fa';
import ProviderBox from '../../components/providerBox/providerBox'; // Import não utilizado, mas mantido
import { useProviderContext } from '../../context/providerSelected';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import UserServices from '../../services/user';
import ProviderServices from '../../services/provider';
import Maps from '../../utils/Maps';


const getImageUrl = (url) => {
    if (!url) return '';

    // Corrigir URLs locais legadas para apontar para produção
    if (url.startsWith('http://127.0.0.1:8000')) {
        return url.replace('http://127.0.0.1:8000', 'https://back-end-servicosja-api.onrender.com');
    }
    if (url.startsWith('http://localhost:8000')) {
         return url.replace('http://localhost:8000', 'https://back-end-servicosja-api.onrender.com');
    }

    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    if (url.startsWith('/img') || url.startsWith('/assets')) return url;
    return `https://back-end-servicosja-api.onrender.com${url}`;
};

// --- COMPONENTE DE GALERIA---
const Gallery = ({ images, onImageSelect, selectedImage }) => {
    return (
        <div className={styles.galleryContainer}>
            {/* Imagem em Destaque */}
            <div className={styles.mainImageContainer}>
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt="Imagem em destaque do prestador"
                        className={styles.mainImage}
                    />
                ) : (
                    <div className={styles.emptyMainImage}>
                        {images.length > 0 ? "Selecione uma imagem para visualizar." : "Este prestador não possui imagens no portfólio."}
                    </div>
                )}
            </div>

            {/* Miniaturas da Galeria */}
            <div className={styles.thumbnailsContainer}>
                {images.length === 0 && (
                   <div style={{color: '#666', fontStyle: 'italic', padding: '10px', width: '100%', textAlign: 'center'}}>
                        Sem fotos disponíveis.
                   </div>
                )}

                {/* Renderiza as miniaturas das imagens do usuário */}
                {images.map((item, index) => (
                    <div
                        key={item.id}
                        className={`${styles.thumbnail} ${item.url === selectedImage ? styles.activeThumbnail : ''}`}
                        onClick={() => onImageSelect(item.url)}
                    >
                        <img src={item.url} alt={`Miniatura ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function ProviderDatails () {
    

    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);
    const [comments, setComments] = useState([]);
    const [fullProviderData, setFullProviderData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // --- CONTEXTOS E HOOKS ---
    const { providerSelected } = useProviderContext();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { initiateContact, getClientSolicitations, toggleFavorite, getFavorites } = UserServices();
    const { getProviderPerfil } = ProviderServices();

    // --- FUNÇÕES DE AUXÍLIO À RENDERIZAÇÃO ---
    const renderStars = (currentRating) => {
        const fullStars = Math.round(currentRating || 0);
        let stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} style={{ color: i < fullStars ? 'gold' : '#e4e5e9' }}>★</span>
            );
        }
        return stars;
    };
    
    // --- EFEITO DE BUSCA DE DADOS ---
    useEffect(() => {
        if (providerSelected?.id) {
            
            if (isAuthenticated && user?.tipo_usuario === 'cliente') {
                getFavorites().then(favs => {
                    if (Array.isArray(favs)) {
                        // Verifica se o ID do prestador está na lista
                        const found = favs.find(f => f.id === providerSelected.id);
                        if (found) setIsFavorite(true);
                    }
                }).catch(err => console.error("Erro ao buscar favoritos:", err));
            }

            getProviderPerfil(providerSelected.id)
                .then(data => {
                    setFullProviderData(data);
                    
              
                    if (data.portfolio && Array.isArray(data.portfolio)) {
                        const formattedImages = data.portfolio.map(item => ({
                            id: item.id,
                            url: getImageUrl(item.imagem)
                        }));
                        setUserGalleryImages(formattedImages);
                        if (formattedImages.length > 0) {
                            setCurrentMainImage(formattedImages[0].url);
                        }
                    }

                  
                    if (data.ultimas_avaliacoes && Array.isArray(data.ultimas_avaliacoes)) {
                        setComments(data.ultimas_avaliacoes);
                    }
                })
                .catch(err => {
                    console.error("Error fetching provider full details:", err);
                });
        }
    }, [providerSelected, getProviderPerfil]);

    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
    };

    
    const DEFAULT_LAT = -15.7801; 
    const DEFAULT_LONG = -47.9292;

    
    const mapLatitude = Number(fullProviderData?.latitude ?? providerSelected?.latitude ?? 0) || DEFAULT_LAT;
    const mapLongitude = Number(fullProviderData?.longitude ?? providerSelected?.longitude ?? 0) || DEFAULT_LONG;
    
   

    const handleToggleFavorite = async () => {
        try {
            await toggleFavorite(providerSelected.id);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar favoritos.");
        }
    };

    const handleRequestService = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (!providerSelected) {
            console.error("No provider selected");
            return;
        }

        try {
            
            let providerUserId = fullProviderData?.user_id || providerSelected.user_id || providerSelected.user || providerSelected.userId;
            
            // Tenta obter o ID do serviço
            let serviceId = fullProviderData?.servico?.id || fullProviderData?.servico || providerSelected.servico?.id || providerSelected.servico;

            
            
            if (!providerUserId) {
                 
                 const fullProfile = await getProviderPerfil(providerSelected.id);
                 if (fullProfile && fullProfile.user_id) {
                     providerUserId = fullProfile.user_id;
                     if (!serviceId && fullProfile.servico) {
                          serviceId = fullProfile.servico.id || fullProfile.servico;
                     }
                 } else {
                     console.error("Could not retrieve user_id from profile details.");
                     alert("Erro: Não foi possível identificar o prestador.");
                     return;
                 }
            }

            if (!providerUserId || !serviceId) {
                console.error("Final IDs are missing:", { providerUserId, serviceId });
                alert("Erro: Não foi possível identificar o prestador ou o serviço.");
                return;
            }

            
            const solicitations = await getClientSolicitations();
            // Filtra: mesmo prestador E realizado E não avaliado
            const pending = solicitations.find(s => 
                (s.prestador === providerUserId || s.prestador_id === providerUserId) && 
                s.servico_realizado && 
                !s.avaliacao_realizada
            );

            if (pending) {
                alert("Você possui um serviço pendente de avaliação com este prestador. Por favor, avalie o serviço anterior antes de solicitar um novo.");
                return;
            }

            const result = await initiateContact(providerUserId, serviceId);
            if (result && result.whatsapp_url) {
                window.open(result.whatsapp_url, '_blank');
            } else {
                alert("O contato foi iniciado, mas não foi possível gerar o link do WhatsApp.");
                console.error("No WhatsApp URL returned");
            }
        } catch (error) {
            console.error("Failed to initiate contact", error);
            alert("Falha ao tentar iniciar o contato com o prestador.");
        }
    }
    

    if (!providerSelected) {
        return <div style={{paddingTop: '100px', textAlign: 'center'}}>Nenhum prestador selecionado.</div>;
    }

    const displayData = fullProviderData || providerSelected;
   
    const notaMedia = Number(displayData.nota_media) || Number(providerSelected.nota_media) || 0; 

    return(
        <div className={styles.providerDatailsContainer}>
           <div className={styles.arrow} onClick={()=>navigate('/services')}>
            <FaArrowLeft />
           </div>

            <div className={styles.providerDatailsHome}>
                <div className={styles.providerDatailsImage}>
                    
                    <img src={getImageUrl(displayData.foto || displayData.perfilImg) || "/img/exemples/Group 8.png"} alt="Imagem do Prestador" />
                </div>

                <div className={styles.providerDatailsInfo}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <h2>{displayData.nome}</h2>
                        {isAuthenticated && user?.tipo_usuario === 'cliente' && (
                            <button 
                                onClick={handleToggleFavorite} 
                                style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#ff4081'}}
                                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                            >
                                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        )}
                    </div>
                    <h5>{displayData.servico?.nome || displayData.categoria || "Serviço Indefinido"}</h5>
                    <div className={styles.line}></div>
                    <p>{displayData.biografia || "Descrição detalhada do prestador de serviço, suas qualificações, experiência e outras informações relevantes que possam ajudar o cliente a tomar uma decisão informada."}</p>
                </div>
            </div>

            <div className={styles.requestService}>
               {user?.tipo_usuario === 'prestador' ? (
                   <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                        Prestadores não podem solicitar serviços.
                   </div>
               ) : (
                   <button onClick={handleRequestService} >Solicitar serviço</button>
               )}
            </div>

            <div className={styles.providerDatailsServices}>
                <div className={styles.providerDatailsAvailableServices}>
                    <div className={styles.providerAvailable}>
                        <h3><FaUserCircle/> {Number(notaMedia).toFixed(1)}</h3>
                        <div className={styles.stars}>

                            <div className={styles.status}>
                                <h5>{notaMedia >= 4.5 ? "Excelente" : notaMedia >= 3 ? "Bom" : "Regular"}</h5>
                            </div>

                            <div className={styles.starFull}>
                                {renderStars(notaMedia)}
                            </div>
                        </div>
                    </div >

                    <div className={styles.comments}>
                        <h3>Últimas Avaliações</h3>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className={styles.commentUser} style={{alignItems: 'flex-start', flexDirection: 'column', gap: '5px'}}>
                                    <div style={{display: 'flex' , flexDirection:'column', alignItems: 'center', justifyContent:'center', gap: '10px', width: '100%'}}>
                                        <h5 style={{margin: 0 }}> <FaUserCircle/> {comment.cliente_nome || "Cliente"}</h5>
                                        <div className={styles.starFull} style={{display:'flex' , alignItems:'center'}}>
                                            {renderStars(comment.nota)}
                                        </div>
                                    </div>
                                    <p style={{fontSize: '0.9em', color: '#333', marginTop: '5px'}}>{comment.comentario}</p>
                                </div>
                            ))
                        ) : (
                            <div style={{padding: '10px', color: '#666', textAlign: 'center', width: '100%'}}>
                                Nenhuma avaliação recente.
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.providerDatailsGallery}>
                    <Gallery
                        images={userGalleryImages}
                        onImageSelect={handleImageSelect}
                        selectedImage={currentMainImage}
                    /> 
                </div>
            </div>

            
            <Maps lat={mapLatitude} long={mapLongitude} />

        </div>
    )
}
