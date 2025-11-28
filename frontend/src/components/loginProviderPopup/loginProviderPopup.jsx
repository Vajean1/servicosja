
import styles from './loginUserPopup.module.css'
import {Dialog} from '@mui/material'
import { useState } from 'react';
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from 'react-router';


export default function LoginProviderPopup ({open, close}) {

        const navigate = useNavigate();
        const [providerLogin, setProviderLogin] = useState({});
    
        const handleChangeLogin = (e) => {
            const { name, value } = e.target;
            
            const newValue = name === 'email' ? value.toLowerCase() : value;
    
            setProviderLogin({
                ...providerLogin,
                [name]: newValue 
            });
        }

        console.log(providerLogin);
   
    return (
        <>
            <Dialog  className={styles.popupContainer} onClose={close} open={open}>
               <div className={styles.popup}>
                    <div className={styles.popupMenu}>
                        <img src="/img/logo/logo.png" alt="Logo serviços já" />
    
                        <div onClick={close} className={styles.exitIcon}>
                            <IoExitOutline />
                        </div>
                    </div>

                    <div className={styles.popupBody}>
                        <h3>Acesse Sua Conta</h3>
                        <p>Entre com email e senha para ter acesso a sua conta</p>

                        <form>
                            <input onChange={handleChangeLogin} name='email' type="email" placeholder='Email' />
                            <input onChange={handleChangeLogin} name='password' type="password" placeholder='Senha' />
                            <button type='submit'>Entrar</button>
                            <a href="#">Esqueceu a senha?</a>
                        </form>
                            
                    </div>

                    <div className={styles.popupFooter}>
                       <button onClick={() => navigate("/providerRegistration")}>Não Tem Uma Conta? Cadastre-se</button>
                    </div>
               </div>

            </Dialog>
        </>
    )   
}