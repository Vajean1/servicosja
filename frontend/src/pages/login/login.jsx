import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

import { FaHelmetSafety } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

import LoginUserPopup from '../../components/loginUserPopup/loginUserPopup';
import LoginProviderPopup from '../../components/loginProviderPopup/loginProviderPopup';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.tipo_usuario === 'prestador') {
                navigate('/providerPerfil');
            } else {
                navigate('/userPerfil');
            }
        }
    }, [isAuthenticated, user, navigate]);


    const [openUser, setOpenUser] = useState(false);

    const handleCloseUser = () => {
        setOpenUser(false);
    }

    const handleOpenUser = () => {
        setOpenUser(true);
    }

    const [openProvider, setOpenProvider] = useState(false);

    // Corrigido para fechar o popup corretamente
    const handleCloseProvider = () => {
        setOpenProvider(false);
    }

    const handleOpenProvider = () => {
        setOpenProvider(true);
    }

    // --- Renderização do componente (mantida) ---

    return (
        <div className={styles.loginContainer}>
            <div onClick={handleOpenProvider} className={styles.loginBoxProvider}>
                <h3><FaHelmetSafety />Profissional</h3>
            </div>

            <div onClick={handleOpenUser} className={styles.loginBoxUser}>
                <h3> <FaUserAlt />Cliente</h3>
            </div>

            {/* Popups renderizados no final */}
            <LoginUserPopup close={handleCloseUser} open={openUser} />
            <LoginProviderPopup close={handleCloseProvider} open={openProvider} />
        </div>
    )
}
