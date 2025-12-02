import styles from './loginUserPopup.module.css';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from 'react-router';
import ProviderServices from '../../services/provider';
import Loading2 from '../../pages/loading/loading2';

export default function LoginProviderPopup ({open, close}) {

    const navigate = useNavigate();
    const [providerLogin, setProviderLogin] = useState({});
    // Adicionamos um estado para feedback de erro/sucesso
    const [error, setError] = useState(null); 

    const { login,loading } = ProviderServices(); // Certifique-se de que ProviderServices é um hook ou retorna a função corretamente.

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        
        // Converte o email para minúsculas
        const newValue = name === 'email' ? value.toLowerCase() : value;

        setProviderLogin({
            ...providerLogin,
            [name]: newValue 
        });
    }

    // NOVA FUNÇÃO PARA TRATAR O SUBMIT DO FORMULÁRIO
    const handleSubmit = async (e) => {
        // 1. **IMPEDE O RECARREGAMENTO DA PÁGINA**
        e.preventDefault(); 
        setError(null); // Limpa erros anteriores

        try {
            
            const result = await login(providerLogin);
            
           
            console.log('Login bem-sucedido:', result);
            close(); 
            navigate('/userPerfil'); 

        } catch (err) {
           
            console.error('Erro de login:', err);
            
            setError(err.detail || 'Falha no login. Verifique suas credenciais.');
        }
    }
    
   
    return (
        <>
            <Dialog className={styles.popupContainer} onClose={close} open={open}>
                <div className={styles.popup}>
                    <div className={styles.popupMenu}>
                        <img src="/img/logo/logo.png" alt="Logo serviços já" />
    
                        <div onClick={close} className={styles.exitIcon}>
                            <IoExitOutline />
                        </div>
                    </div>
                    
                    
                    <div className={styles.popupBody}>
                        {loading ? <Loading2/>:
                        <>
                            <h3>Acesse Sua Conta</h3>
                        <p>Entre com email e senha para ter acesso a sua conta</p>

                        {/* 3. ADICIONA O onSubmit AQUI */}
                        <form onSubmit={handleSubmit}> 
                            <input onChange={handleChangeLogin} name='email' type="email" placeholder='Email' required/>
                            <input onChange={handleChangeLogin} name='password' type="password" placeholder='Senha' required/>
                            
                            {/* EXIBIÇÃO DE ERRO */}
                            {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}

                            {/* O BOTÃO AGORA SÓ PRECISA SER type='submit' */}
                            <button type='submit'>Entrar</button> 
                            
                            <a href="#">Esqueceu a senha?</a>
                        </form>
                        </>
                        }
                        
                            
                    </div>

                    <div className={styles.popupFooter}>
                        <button onClick={() => navigate("/userRegistration")}>Não Tem Uma Conta? Cadastre-se</button>
                    </div>
                </div>

            </Dialog>
        </>
    )
}
