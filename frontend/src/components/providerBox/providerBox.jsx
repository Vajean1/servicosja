import styles from './providerBox.module.css'
import { FaStar } from 'react-icons/fa'  
import {useNavigate} from 'react-router-dom';

export default function ProviderBox ({name , location, resum, rating, image}) {

    const naviagtion = useNavigate();

    const extrairNomeSobrenome = (nome) => {
        // Safety check to handle non-string or empty input
        if (typeof nome !== 'string' || nome.trim() === "") {
            return { primeiroNome: "", sobrenome: "", nomesDoMeio: "" };
        }
        
        const partesDoNome = nome.trim().split(/\s+/);

        if (partesDoNome.length === 0) {
            return { primeiroNome: "", sobrenome: "", nomesDoMeio: "" };
        }

        const primeiroNome = partesDoNome[0];
        // Ensure there is more than one part before trying to get the last part as a surname
        const sobrenome = partesDoNome.length > 1 ? partesDoNome[partesDoNome.length - 1] : "";
        const nomesDoMeioArray = partesDoNome.slice(1, partesDoNome.length - 1);
        const nomesDoMeio = nomesDoMeioArray.join(" ");

        return { primeiroNome, sobrenome, nomesDoMeio };
    };

    // 💡 FIX: Destructure ALL necessary name parts here!
    const { primeiroNome, sobrenome, nomesDoMeio } = extrairNomeSobrenome(name);
    
    // Helper function to render stars dynamically using Unicode or imported icon
    const renderStars = (currentRating) => {
        const fullStars = Math.round(currentRating); // Use Math.round for standard star rendering
        let starsString = "";
        for (let i = 0; i < 5; i++) {
            starsString += (i < fullStars) ? "★" : "☆";
        }
        return starsString;
    };
    
    return (
        <div className={styles.providerBox} onClick={() => naviagtion('/providerDatails')}>
            <img src={image || "/img/exemples/Group 8.png"} alt="imagem usuario" />
            <div className={styles.providerInfos}>
                {/* Now 'primeiroNome' and 'sobrenome' are properly defined in scope */}
                <h3>{primeiroNome} {sobrenome}</h3>
                <p>{location}</p>

                <div className={styles.providerResum}>
                    <p>{resum}</p>
                    <div className={styles.starSponsored}>
                        {/* Simplified star rendering based on your logic */}
                        {renderStars(rating)}
                    </div>
                </div>
            </div>
        </div>
    )

}
