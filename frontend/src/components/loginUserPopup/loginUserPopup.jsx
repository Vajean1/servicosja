import { useNavigate } from 'react-router';
import styles from './loginUserPopup.module.css'
import {Dialog} from '@mui/material'
import { IoExitOutline } from "react-icons/io5";
import { useState } from 'react';


export default function LoginUserPopup ({open, close}) {

    const [userLogin, setUserLogin] = useState({});

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        
        const newValue = name === 'email' ? value.toLowerCase() : value;

        setUserLogin({
            ...userLogin,
            [name]: newValue 
        });
    }

    console.log(userLogin);
   const navigate = useNavigate();
    return (
        <>
            <Dialog className={styles.popupContainer} onClose={close} open={open}>
               <div className={styles.popup}>
                    <div className={styles.popupMenu}>
                          <img src="/img/logo/logo.png" alt="Logo serviços já" />
                         <h2>Entrar</h2>
                         <div onClick={close} className={styles.exitIcon}>
                             <IoExitOutline />
                         </div>
                    </div>

                    <div className={styles.popupBody}>
                        <h3>Acesse Sua Conta</h3>
                        <p>Entre com email e senha para ter acesso a sua conta</p>

                        <form>
                            
                            <input
                                onChange={ handleChangeLogin}
                                type="email"
                                placeholder='Email'
                                name="email" 
                            />
                           
                            <input 
                                onChange={ handleChangeLogin} 
                                type="password" 
                                placeholder='Senha' 
                                name="password"
                            />
                        
                            <button 
                                onClick={() => navigate('/userPerfil')} 
                                type='submit'
                            >
                                Entrar
                            </button>
                            <a href="#">Esqueceu a senha?</a>
                        </form>
                            
                    </div>

                    <div className={styles.popupFooter}>
                        <a href="/userRegistration"><button>Não Tem Uma Conta? Cadastre-se</button></a>
                    </div>
               </div>

            </Dialog>
        </>
    )  
}