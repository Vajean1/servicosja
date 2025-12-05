import styles from './providerBox.module.css'
import { FaStar } from 'react-icons/fa'  
import {useNavigate} from 'react-router-dom';

export default function ProviderBox ({name , location, resum, rating, image}) {

    const naviagtion = useNavigate();
    const MAX_RESUM_LENGTH = 95; // Define o limite máximo de caracteres

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
        // O Sobrenome deve ser a última parte do nome para nomes com mais de 2 partes.
        // Se houver apenas 1 parte, 'sobrenome' será uma string vazia, o que é tratado abaixo.
        const sobrenome = partesDoNome.length > 1 ? partesDoNome[partesDoNome.length - 1] : "";
        
        // Nomes do meio (do segundo nome até o penúltimo)
        const nomesDoMeioArray = partesDoNome.slice(1, partesDoNome.length - 1);
        const nomesDoMeio = nomesDoMeioArray.join(" ");

        // ⚠️ Nota: No código original, se o nome tivesse 2 partes ("Nome Sobrenome"), 'sobrenome' era a segunda parte, 
        // mas 'nomesDoMeio' era uma string vazia.
        // A linha "const sobrenome = partesDoNome.length > 0 ? partesDoNome[1] : "";" no código original
        // parecia não estar considerando nomes completos com múltiplos nomes. Ajustei para pegar a última parte como sobrenome.
        // Para manter a lógica original (apenas primeiro nome e o nome seguinte, se houver), você manteria:
        // const sobrenome = partesDoNome.length > 1 ? partesDoNome[1] : "";
        // const nomesDoMeio = ""; // Ou manteria o slice original (que resultaria em string vazia para nomes de 2 partes).
        // O componente está usando APENAS {primeiroNome} {sobrenome}, então vou manter a lógica que pega a segunda parte como "sobrenome"
        // e ignora os nomes do meio para o cabeçalho.
        const sobrenomeParaComponente = partesDoNome.length > 1 ? partesDoNome[1] : "";

       return { primeiroNome, sobrenome: sobrenomeParaComponente, nomesDoMeio };
    };

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
    
    // ✨ Lógica para truncar o resumo e adicionar "Leia mais..."
    const isResumTruncated = resum && resum.length > MAX_RESUM_LENGTH;
    const truncatedResum = isResumTruncated 
        ? resum.substring(0, MAX_RESUM_LENGTH) + "..." 
        : resum;

    // A função onClick () já leva para '/providerDatails', que seria o lugar para ver o resumo completo.
    // O texto "Leia mais..." pode usar o mesmo handler ou um link, mas como o `div` principal já é clicável,
    // o texto será apenas um indicativo.

    return (
        <div className={styles.providerBox} onClick={() => naviagtion('/providerDatails')}>
            <img src={image || "/img/exemples/Group 8.png"} alt="imagem usuario" />
            <div className={styles.providerInfos}>
                <h3>{primeiroNome} {sobrenome}</h3>
                <p>{location}</p>

                <div className={styles.providerResum}>
                    <p>
                        {truncatedResum}
                        {isResumTruncated && (
                            <span className={styles.readMore}>Leia mais...</span>
                        )}
                    </p>
                    <div className={styles.starSponsored}>
                        {renderStars(rating)}
                    </div>
                </div>
            </div>
        </div>
    )

}