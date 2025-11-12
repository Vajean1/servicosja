import styles from './footer.module.css'
import { FaRegUser , FaInstagram , FaLinkedin } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import {Link} from 'react-router-dom'

export default function Footer () {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.logoContainer}>
                <img src="/img/logo/logoFooter.png" alt="" />
            </div>

            <div className={styles.infosContainer}>
                <div className={styles.contacts}>
                    <button><FaRegUser className={styles.icon} />Atendimento Online</button>
                    <h3>Contato</h3>
                    <p><BsTelephone className={styles.icon}/>(81) 98635-4475</p>
                    <p><CiMail className={styles.icon}/>atendimento@servicosja.com.br</p>
                </div>

                <div className={styles.social}>
                    <h3>Redes Sociais</h3>
                    <div><a  href='https://www.instagram.com/' target='_blank'  className={styles.icon}><FaInstagram /></a > <a href='https://www.linkedin.com/' target='_blank'  className={styles.icon}><FaLinkedin/></a></div>
                    <h3>Parceiros</h3>
                    <img src='/img/partners/partners.png'/>
                </div>
            </div>
            <div className={styles.terms}>
                <a href="#">Política de privacidade</a>
                <a href="#">Termos de uso</a>
                <a href="#">© Todos os direitos reservados 2025</a>
            </div>
        </footer>
    )
}