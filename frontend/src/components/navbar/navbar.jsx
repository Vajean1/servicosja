import { Link, useLocation } from 'react-router-dom';
import styles from './navbar.module.css';
import { FaRegUser } from "react-icons/fa";

export default function Navbar () {
    
    const location = useLocation();
    const currentPath = location.pathname;

    
    const isNavLinkActive = (path) => {
   
        if (path === '/') {
            return currentPath === path;
        }
       
        return currentPath.startsWith(path);
    };

    const getLinkClassName = (path) => {
        let className = styles.navLink;
        if (isNavLinkActive(path)) {
            className = `${className} ${styles.navLinkSelect}`;
        }
        return className;
    };

    return (
        <nav className={styles.navbarContainer}>
            <img src="/img/logo/logo.png" alt="logo Serviçosjá"/>

            <div className={styles.navLinkContainer}>
                
                <Link 
                    className={getLinkClassName('/')} 
                    to={'/'}
                >
                    Inicio
                </Link>
                <Link 
                    className={getLinkClassName('/services')} 
                    to={'/services'}
                >
                    Serviços
                </Link>
                <Link 
                    className={getLinkClassName('/about')} 
                    to={'/about'}
                >
                    Sobre nós
                </Link>
                <Link 
                    className={getLinkClassName('/plans')} 
                    to={'/plans'}
                >
                    Planos
                </Link >
                <Link to={'/login'} className={styles.loginButton}> 
                    <FaRegUser className={styles.icon} /> Entrar
                </Link>
            </div> 
        </nav>
    )
}