
import styles from './providerContactPopup.module.css'
import {Dialog} from '@mui/material'
import { IoExitOutline } from "react-icons/io5";


export default function ProviderContactPopup ({open, close}) {

   
    return (
        <>
            <Dialog  className={styles.popupContainer} onClose={close} open={open}>
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
                            <input type="email" placeholder='Email' />
                            <input type="password" placeholder='Senha' />
                            <button type='submit'>Entrar</button>
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