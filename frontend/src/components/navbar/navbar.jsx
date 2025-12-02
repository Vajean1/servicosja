import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './navbar.module.css';
import { FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { Drawer } from '@mui/material';
import { TiThMenu } from "react-icons/ti";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar () {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    const currentPath = location.pathname;

    const [openMenu , setOpenMenu] = useState(false);
    
    const [lastScrollY, setLastScrollY] = useState(0); 
    
    const [showNavbar, setShowNavbar] = useState(true); 

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    
    const controlNavbar = () => {
        
        if (typeof window !== 'undefined' && window.scrollY > lastScrollY && window.scrollY > 100) {
            
            setShowNavbar(false); 
        } 
       
        else if (typeof window !== 'undefined' && window.scrollY < lastScrollY || window.scrollY <= 100) {
            
            setShowNavbar(true);
        }
        
        // Atualiza a última posição de rolagem
        setLastScrollY(window.scrollY); 
    };

    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]); 

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
        
        <nav className={`${styles.navbarContainer} ${showNavbar ? '' : styles.navbarHidden}`}>
            <Link to={'/'}><img src="/img/logo/logo.png" alt="logo Serviçosjá"/></Link>

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
                {isAuthenticated ? (
                    <>
                        <Link to={user?.tipo_usuario === 'prestador' ? '/providerPerfil' : '/userPerfil'} className={styles.loginButton}>
                            <FaRegUser className={styles.icon} /> {user?.nome?.split(' ')[0] || 'Perfil'}
                        </Link>
                        <div onClick={handleLogout} className={styles.loginButton} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                             <FaSignOutAlt className={styles.icon} /> Sair
                        </div>
                    </>
                ) : (
                    <Link to={'/login'} className={styles.loginButton}>
                        <FaRegUser className={styles.icon} /> Entrar
                    </Link>
                )}


            </div>

            <div className={styles.MobileNavbarLinksContainer}>
                <TiThMenu className={styles.navbarIcons} onClick={handleOpenMenu} /> 
            </div>

            <Drawer
                anchor='right'
                open={openMenu}
                onClose={handleOpenMenu}>
                        
                <div className={styles.drawer}>
                            <Link 
                    className={getLinkClassName('/')} 
                    to={'/'}
                    onClick={handleOpenMenu}
                >
                    Inicio
                </Link>
                <Link 
                    className={getLinkClassName('/services')} 
                    to={'/services'}
                    onClick={handleOpenMenu}
                >
                    Serviços
                </Link>
                <Link 
                    className={getLinkClassName('/about')} 
                    to={'/about'}
                    onClick={handleOpenMenu}
                >
                    Sobre nós
                </Link>
                <Link 
                    className={getLinkClassName('/plans')} 
                    to={'/plans'}
                    onClick={handleOpenMenu}
                >
                    Planos
                </Link >
                {isAuthenticated ? (
                    <>
                        <Link to={user?.tipo_usuario === 'prestador' ? '/providerPerfil' : '/userPerfil'} onClick={handleOpenMenu} className={styles.loginButton}>
                            <FaRegUser className={styles.icon} /> {user?.nome?.split(' ')[0] || 'Perfil'}
                        </Link>
                        <div onClick={() => { handleLogout(); handleOpenMenu(); }} className={styles.loginButton} style={{ cursor: 'pointer' }}>
                             <FaSignOutAlt className={styles.icon} /> Sair
                        </div>
                    </>
                ) : (
                    <Link to={'/login'} onClick={handleOpenMenu} className={styles.loginButton}>
                        <FaRegUser className={styles.icon} /> Entrar
                    </Link>
                )}
                        </div>
                        
                </Drawer>
        </nav>
    )
}
