import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import styles from './login.module.css';


import { FaHelmetSafety } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

import LoginUserPopup from '../../components/loginUserPopup/loginUserPopup';
import LoginProviderPopup from '../../components/loginProviderPopup/loginProviderPopup';

export default function Login () {
    // Inicializa o hook de navegação
    const navigate = useNavigate();

    // Hook useEffect para checar o localStorage na montagem do componente
    useEffect(() => {
        // Verifica se 'auth' existe no localStorage
        const auth = localStorage.getItem('auth');
        const authData = JSON.parse(auth)
        const userType = authData?.tipo_usuario


        if (userType === "prestador") {
            // Se 'auth' existir, redireciona para '/providerPerfil'
            console.log('Item "auth" encontrado no localStorage. Redirecionando...');
            navigate('/providerPerfil');
        }

        if (userType === "cliente") {
            // Se 'auth' existir, redireciona para '/providerPerfil'
            console.log('Item "auth" encontrado no localStorage. Redirecionando...');
            navigate('/userPerfil');
        }


    }, [navigate]); // O array de dependências inclui 'navigate'

    // --- Lógica de estado e popups (mantida) ---

    const [openUser, setOpenUser] = useState(false);
    
    // Corrigido para fechar o popup corretamente
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

    return(
        <div className={styles.loginContainer}>
            <div onClick={handleOpenProvider} className={styles.loginBoxProvider}>
                <h3><FaHelmetSafety />Profissional</h3>
            </div>

            <div onClick={handleOpenUser} className={styles.loginBoxUser}>
                <h3> <FaUserAlt />Usuario</h3>
            </div>
            
            {/* Popups renderizados no final */}
            <LoginUserPopup close={handleCloseUser} open={openUser} />
            <LoginProviderPopup close={handleCloseProvider} open={openProvider} />
        </div>
    )
}