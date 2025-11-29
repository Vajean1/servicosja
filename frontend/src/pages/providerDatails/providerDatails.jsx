import {useState, useEffect} from 'react';

import styles from './providerDatails.module.css';
import {FaUserCircle} from 'react-icons/fa';
import ProviderBox from '../../components/providerBox/providerBox';
import ProviderContactPopup from '../../components/providerContactPopup/providerContactPopup';
import { useProviderContext } from '../../context/providerSelected';

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



export default function UserPerfil () {
    const [openProvider, setOpenProvider] = useState(false);

    
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);

    const { providerSelected } = useProviderContext();
    
    
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

    const handleCloseProvider = () => {
        setOpenProvider(!openProvider);
    }  

    const handleOpenProvider = () => {
        setOpenProvider(true);
    }
    console.log(providerSelected)

    return(
        <div className={styles.providerDatailsContainer}>
           

            <div className={styles.providerDatailsHome}>
                <div className={styles.providerDatailsImage}>
                    <img src="/img/exemples/Group 8.png" alt="Imagem do Prestador" />
                </div>

                <div className={styles.providerDatailsInfo}>
                    <h2>{providerSelected.nome}</h2>
                    <h5>{providerSelected.servico.nome}</h5>
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