import styles from './providerBox.module.css'
import { FaStar } from 'react-icons/fa'  
import {useNavigate} from 'react-router-dom';

export default function ProviderBox ({name , location, resum, rating}) {

    const naviagtion = useNavigate();

    
   return (
        <div className={styles.providerBox} onClick={() => naviagtion('/providerDatails')}>
            <img src="/img/exemples/Group 8.png" alt="imagem usuario" />
            <div className={styles.providerInfos}>
                <h3>{name}</h3>
                <p>{location}</p>

                <div className={styles.providerResum}>
                    <p>{resum}</p>
                    <div className={styles.starSponsored}>
                        {rating == 5 && (
                            <>
                                ★★★★★
                            </>
                        )}
                           
                        {rating >= 4 && rating < 5 && (
                            <>
                                ★★★★☆
                            </>
                            )}   

                        {rating >= 3 && rating < 4 && (
                            <>
                                ★★★☆☆
                            </>
                            )}

                        {rating >= 2 && rating < 3 && (
                            <>
                                ★★☆☆☆
                            </>
                            )}

                        {rating >= 1 && rating < 2 && (
                            <>
                                ★☆☆☆☆
                            </>
                            )}            
                   </div>
                </div>
            </div>
        </div>
    )

}