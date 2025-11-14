import styles from './footer.module.css'
import { FaRegUser , FaInstagram , FaLinkedin ,FaFacebook,FaTwitter } from "react-icons/fa";
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

                <div className={styles.footerMap}>
                <h4>Mapa do site</h4>
                <Link className={styles.infosContainerLink} to="/">Home</Link>
                <Link className={styles.infosContainerLink} to="/services">Serviços</Link>
                <Link className={styles.infosContainerLink} to="/about">Sobre nós</Link>
                <Link className={styles.infosContainerLink} to="/">Planos</Link>
                <Link className={styles.infosContainerLink} to="/">Sou um profissional</Link>
            </div>


                <div className={styles.contacts}>
                    <button><FaRegUser className={styles.icon} />Atendimento Online</button>
                    <h3>Contato</h3>
                    <p><BsTelephone className={styles.icon}/>(81) 98635-4475</p>
                    <p><CiMail className={styles.icon}/>atendimento@servicosja.com.br</p>
                </div>

                <div className={styles.social}>
                    <h3>Redes Sociais</h3>
                    <div> <a href='https://www.linkedin.com/' target='_blank'  className={styles.iconbg}><FaLinkedin/></a> <a  href='https://www.instagram.com/' target='_blank'  className={styles.iconbg}><FaInstagram /></a > <a  href='https://www.instagram.com/' target='_blank'  className={styles.iconbg}><FaFacebook /></a > <a  href='https://www.instagram.com/' target='_blank'  className={styles.iconbg}><FaTwitter /></a ></div>
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