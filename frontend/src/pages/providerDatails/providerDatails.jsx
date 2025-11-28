import {useState, useEffect} from 'react';

import styles from './providerDatails.module.css';
import {FaUserCircle} from 'react-icons/fa';
import ProviderBox from '../../components/providerBox/providerBox';
import ProviderContactPopup from '../../components/providerContactPopup/providerContactPopup';

// --- COMPONENTE DE GALERIA ---
const Gallery = ({ images, onImageSelect, onImageUpload, selectedImage }) => {
    // Certifique-se de que a imagem selecionada é a URL
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
// ----------------------------------------------------------------------


export default function UserPerfil () {
    const [openProvider, setOpenProvider] = useState(false);

    // Armazena objetos { id, url }
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);

    
    // EFEITO DE LIMPEZA: Revoga as URLs temporárias de objeto
    // A função de retorno é executada ANTES da próxima renderização ou desmontagem.
    // Isso garante que as URLs antigas (se forem substituídas/descartadas) sejam limpas.
    useEffect(() => {
        return () => {
             // Limpa todas as URLs temporárias ao desmontar o componente.
             userGalleryImages.forEach(item => URL.revokeObjectURL(item.url));
        };
    // Sem dependências, ele é chamado apenas na desmontagem
    }, []); 
    
    // EFEITO DE GERENCIAMENTO DE DESTAQUE: Garante que haja um destaque
    useEffect(() => {
        const imageUrls = userGalleryImages.map(item => item.url);
        
        // Se a imagem principal atual não existe mais no array, ou se não há imagem principal
        // mas há imagens na galeria, define a primeira como destaque.
        if (userGalleryImages.length > 0 && 
            (!currentMainImage || !imageUrls.includes(currentMainImage))) {
            
            setCurrentMainImage(userGalleryImages[0].url);
            
        } else if (userGalleryImages.length === 0) {
            setCurrentMainImage(null);
        }
        
    }, [userGalleryImages, currentMainImage]);


    // Função para adicionar uma nova imagem
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Cria uma URL temporária. ESTA URL PERMANECE VÁLIDA até ser revogada.
            const newImageUrl = URL.createObjectURL(file);
            const newImageItem = {
                id: Date.now() + Math.random(),
                url: newImageUrl
            };
            
            // Adiciona o novo item ao array
            setUserGalleryImages(prevImages => [...prevImages, newImageItem]);
            
            // Define a nova imagem como a imagem principal automaticamente
            // Isso acionará o useEffect de gerenciamento de destaque, se necessário.
            setCurrentMainImage(newImageUrl);
        }
        event.target.value = null;
    };

    // Função para selecionar uma imagem para o destaque
    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
    };

    const handleCloseProvider = () => {
        setOpenProvider(!openProvider);
    }  

    const handleOpenProvider = () => {
        setOpenProvider(true);
    }

    return(
        <div className={styles.providerDatailsContainer}>
            {/* ... restante do seu código ... */}

            <div className={styles.providerDatailsHome}>
                <div className={styles.providerDatailsImage}>
                    <img src="/img/exemples/Group 8.png" alt="Imagem do Prestador" />
                </div>

                <div className={styles.providerDatailsInfo}>
                    <h2>Nome do Prestador</h2>
                    <h5>Especialidade</h5>
                    <div className={styles.line}></div>
                    <p>Descrição detalhada do prestador de serviço, suas qualificações, experiência e outras informações relevantes que possam ajudar o cliente a tomar uma decisão informada.</p>
                </div>
            </div>

            <div className={styles.requestService}>
               <button onClick={handleOpenProvider} >Solicitar serviço</button>
            </div>

            <div className={styles.providerDatailsServices}>
                <div className={styles.providerDatailsAvailableServices}>
                    <div className={styles.providerAvailable}>
                        <h3><FaUserCircle/>  4.6</h3>
                        <div className={styles.stars}>

                            <div className={styles.status}>
                                <h5>Exelente</h5>
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



            <div className={styles.proviersSearch}>
                <ProviderBox name={"Aline Souza"} location={'Recife, Boa Vigem'} rating={5} resum={'Trancista. Especialista em tranças e penteados afro. Atendimento em domicílio.'} />
                <ProviderBox name={"Aline Souza"} location={'Recife, Boa Vigem'} rating={4.9} resum={'Trancista. Especialista em tranças e penteados afro. Atendimento em domicílio.'}  />
                <ProviderBox name={"Aline Souza"} location={'Recife, Boa Vigem'} rating={3} resum={'Trancista. Especialista em tranças e penteados afro. Atendimento em domicílio.'}  />
            </div>

            <ProviderContactPopup open={openProvider} close={handleCloseProvider} />
        </div>
    )
}