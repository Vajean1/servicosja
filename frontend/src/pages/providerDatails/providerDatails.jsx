import {useState, useEffect} from 'react';

import styles from './providerDatails.module.css';
import {FaUserCircle} from 'react-icons/fa';
import ProviderBox from '../../components/providerBox/providerBox';
import { useProviderContext } from '../../context/providerSelected';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import UserServices from '../../services/user';
import ProviderServices from '../../services/provider';

// --- COMPONENTE DE GALERIA ---
const Gallery = ({ images, onImageSelect, onImageUpload, selectedImage }) => {
    
    

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
                        Adicione e selecione uma imagem para ver em destaque.
                    </div>
                )}
            </div>

            {/* Miniaturas da Galeria e Botão de Adicionar */}
            <div className={styles.thumbnailsContainer}>

                {/* Botão de Adicionar Foto (Input escondido) */}
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



export default function ProviderDatails () {
    
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);

    const { providerSelected } = useProviderContext();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { initiateContact } = UserServices();
    const { getProviderPerfil } = ProviderServices();
    
    
    useEffect(() => {
        return () => {
             
             userGalleryImages.forEach(item => URL.revokeObjectURL(item.url));
        };

    }, []); 
    

    useEffect(() => {
        const imageUrls = userGalleryImages.map(item => item.url);
        

        if (userGalleryImages.length > 0 && 
            (!currentMainImage || !imageUrls.includes(currentMainImage))) {
            
            setCurrentMainImage(userGalleryImages[0].url);
            
        } else if (userGalleryImages.length === 0) {
            setCurrentMainImage(null);
        }
        
    }, [userGalleryImages, currentMainImage]);



    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
           
            const newImageUrl = URL.createObjectURL(file);
            const newImageItem = {
                id: Date.now() + Math.random(),
                url: newImageUrl
            };
            
          
            setUserGalleryImages(prevImages => [...prevImages, newImageItem]);
            
         
            setCurrentMainImage(newImageUrl);
        }
        event.target.value = null;
    };

 
    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
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
            // Need service ID. providerSelected.servico might be object or ID.
            let serviceId = providerSelected.servico?.id || providerSelected.servico;
            // Attempt to get user_id from various common property names
            let providerUserId = providerSelected.user_id || providerSelected.user || providerSelected.userId;

            console.log("Handle Request Service - Selected:", providerSelected);
            
            // FIX: If user_id is missing, fetch full profile
            if (!providerUserId) {
                console.log("user_id missing in context, fetching profile...");
                try {
                    // Use id (profile id) to fetch
                    const fullProfile = await getProviderPerfil(providerSelected.id);
                    if (fullProfile && fullProfile.user_id) {
                        providerUserId = fullProfile.user_id;
                        // Also update serviceId if needed
                        if (!serviceId && fullProfile.servico) {
                             serviceId = fullProfile.servico.id || fullProfile.servico;
                        }
                    } else {
                        console.error("Could not retrieve user_id from profile details.");
                        alert("Erro: Não foi possível identificar o prestador.");
                        return;
                    }
                } catch (err) {
                    console.error("Error fetching provider profile:", err);
                    alert("Erro ao buscar dados do prestador.");
                    return;
                }
            }

            console.log("Handle Request Service - Final IDs:", { providerUserId, serviceId });

            const result = await initiateContact(providerUserId, serviceId);
            if (result && result.whatsapp_url) {
                window.open(result.whatsapp_url, '_blank');
            } else {
                console.error("No WhatsApp URL returned");
            }
        } catch (error) {
            console.error("Failed to initiate contact", error);
            // alert("Erro ao iniciar contato. Tente novamente.");
        }
    }
    
    // Safety check if providerSelected is null
    if (!providerSelected) {
        return <div style={{paddingTop: '100px', textAlign: 'center'}}>Nenhum prestador selecionado.</div>;
    }

    return(
        <div className={styles.providerDatailsContainer}>
           <div className={styles.arrow} onClick={()=>navigate('/services')}>
            <FaArrowLeft />
           </div>

            <div className={styles.providerDatailsHome}>
                <div className={styles.providerDatailsImage}>
                    <img src={providerSelected.foto || "/img/exemples/Group 8.png"} alt="Imagem do Prestador" />
                </div>

                <div className={styles.providerDatailsInfo}>
                    <h2>{providerSelected.nome}</h2>
                    <h5>{providerSelected.servico?.nome || providerSelected.categoria}</h5>
                    <div className={styles.line}></div>
                    <p>{providerSelected.biografia || "Descrição detalhada do prestador de serviço, suas qualificações, experiência e outras informações relevantes que possam ajudar o cliente a tomar uma decisão informada."}</p>
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
                        <h3><FaUserCircle/> {providerSelected.nota_media || '4.6'}</h3>
                        <div className={styles.stars}>

                            <div className={styles.status}>
                                <h5>Excelente</h5>
                            </div>

                            <div className={styles.starFull}>
                                ★★★★★
                            </div>
                        </div>
                    </div >

                    <div className={styles.comments}>
                        <div className={styles.commentUser}>
                            <h5> <FaUserCircle/>  Muito profissional!</h5>
                            <div className={styles.starFull}>
                                ★★★★★
                            </div>
                        </div>

                        <div className={styles.commentUser}>
                            <h5> <FaUserCircle/>  pontual!</h5>
                            <div className={styles.starFull}>
                                ★★★★★
                            </div>
                        </div>

                        <div className={styles.commentUser}>
                            <h5> <FaUserCircle/>  Otimo profissional!</h5>
                            <div className={styles.starFull}>
                                ★★★★★
                            </div>
                        </div>

                        <div className={styles.commentUser}>
                            <h5> <FaUserCircle/>  Muito profissional!</h5>
                            <div className={styles.starFull}>
                                ★★★★★
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.providerDatailsGallery}>
                    <Gallery
                        images={userGalleryImages}
                        onImageSelect={handleImageSelect}
                        onImageUpload={handleImageUpload}
                        selectedImage={currentMainImage}
                    /> 
                </div>
            </div>

        </div>
    )
}
