import {useState} from 'react';

import styles from './userPerfil.module.css';
import {FaUserCircle} from 'react-icons/fa';
import ProviderBox from '../../components/providerBox/providerBox';
import ProviderContactPopup from '../../components/providerContactPopup/providerContactPopup';

export default function UserPerfil () {

       const [openProvider, setOpenProvider] = useState(false);
    
        const handleCloseProvider = () => {
            setOpenProvider(!openProvider);
        }   

        const handleOpenProvider = () => {
            setOpenProvider(true);
        }
    
    return(
        <div className={styles.providerDatailsContainer}>
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
                        <h3><FaUserCircle/>  4.6</h3>
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
                               <h5> <FaUserCircle/>  Muito profissional!</h5>

                                <div className={styles.starFull}>
                                ★★★★★
                                 </div>
                            </div>   

                           
                             <div className={styles.commentUser}>
                               <h5> <FaUserCircle/>  pontual!</h5>

                                <div className={styles.starFull}>
                                ★★★★★
                                 </div>
                            </div>  

                             <div className={styles.commentUser}>
                               <h5> <FaUserCircle/>  Otimo profissional!</h5>

                                <div className={styles.starFull}>
                                ★★★★★
                                 </div>
                            </div>  

                             <div className={styles.commentUser}>
                               <h5> <FaUserCircle/>  Muito profissional!</h5>

                                <div className={styles.starFull}>
                                ★★★★★
                                 </div>
                            </div>   
                        </div>     
                </div>    

                <div className={styles.providerDatailsGallery}>
                    <div className={styles.imgGallery}><img src="/img/exemples/ex1.jpg" alt="Galeria do prestador" /></div>
                    <div className={styles.imgGallery}><img src="/img/exemples/ex2.jpg" alt="Galeria do prestador" /></div>
                    <div className={styles.imgGallery}><img src="/img/exemples/ex3.jpg" alt="Galeria do prestador" /></div>
                    <div className={styles.imgGallery}><img src="/img/exemples/ex4.jpg" alt="Galeria do prestador" /></div>
                    <div className={styles.imgGallery}><img src="/img/exemples/ex5.png" alt="Galeria do prestador" /></div>
                    <div className={styles.imgGallery}><img src="/img/exemples/ex5.png" alt="Galeria do prestador" /></div>
                </div>
            </div>

           

            <div className={styles.proviersSearch}>
                <ProviderBox />
                <ProviderBox />
                <ProviderBox />

            </div>

            <ProviderContactPopup open={openProvider} close={handleCloseProvider} />
        </div>
    )
}