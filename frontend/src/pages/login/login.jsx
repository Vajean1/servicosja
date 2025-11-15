import { useState } from 'react';

import styles from './login.module.css'
import { FaHelmetSafety } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import LoginUserPopup from '../../components/loginUserPopup/loginUserPopup';
import LoginProviderPopup from '../../components/loginProviderPopup/loginProviderPopup';

export default function Login () {

     const [openUser, setOpenUser] = useState(false);
    
        const handleCloseUser = () => {
            setOpenUser(!open);
        }  
        
        

        const handleOpenUser = () => {
            setOpenUser(true);
        }


        
     const [openProvider, setOpenProvider] = useState(false);
    
        const handleCloseProvider = () => {
            setOpenProvider(!open);
        }   

        const handleOpenProvider = () => {
            setOpenProvider(true);
        }
    
    return(
        <div className={styles.loginContainer}>
            <div onClick={handleOpenProvider} className={styles.loginBoxProvider}>
                <h3><FaHelmetSafety />Profissional</h3>
            </div>

            <div onClick={handleOpenUser} className={styles.loginBoxUser}>
                <h3> <FaUserAlt />Usuario</h3>
            </div>
            <LoginUserPopup close={handleCloseUser} open={openUser} />
            <LoginProviderPopup close={handleCloseProvider} open={openProvider} />
        </div>
    )
}