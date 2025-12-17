import styles from './providerBox.module.css'
import { FaStar } from 'react-icons/fa'  
import {useNavigate} from 'react-router-dom';

export default function ProviderBox ({name , location, resum, rating, image}) {

   const naviagtion = useNavigate();
   const MAX_RESUM_LENGTH = 65; // Define o limite máximo de caracteres

   const extrairNomeSobrenome = (nome) => {
      
      if (typeof nome !== 'string' || nome.trim() === "") {
         return { primeiroNome: "", sobrenome: "", nomesDoMeio: "" };
      }
      
      const partesDoNome = nome.trim().split(/\s+/);

      if (partesDoNome.length === 0) {
         return { primeiroNome: "", sobrenome: "", nomesDoMeio: "" };
      }

      const primeiroNome = partesDoNome[0];

      const sobrenome = partesDoNome.length > 1 ? partesDoNome[partesDoNome.length - 1] : "";
      
      // Nomes do meio 
      const nomesDoMeioArray = partesDoNome.slice(1, partesDoNome.length - 1);
      const nomesDoMeio = nomesDoMeioArray.join(" ");

      const sobrenomeParaComponente = partesDoNome.length > 1 ? partesDoNome[1] : "";

    return { primeiroNome, sobrenome: sobrenomeParaComponente, nomesDoMeio };
   };

   const { primeiroNome, sobrenome, nomesDoMeio } = extrairNomeSobrenome(name);
   

   const renderStars = (currentRating) => {
      const fullStars = Math.round(currentRating);
      let starsString = "";
      for (let i = 0; i < 5; i++) {
         starsString += (i < fullStars) ? "★" : "☆";
      }
      return starsString;
   };
   
   //  Lógica para truncar o resumo e adicionar "Leia mais..."
   const isResumTruncated = resum && resum.length > MAX_RESUM_LENGTH;
   const truncatedResum = isResumTruncated 
      ? resum.substring(0, MAX_RESUM_LENGTH) + "..." 
      : resum;



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