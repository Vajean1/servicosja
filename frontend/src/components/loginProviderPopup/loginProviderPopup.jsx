import styles from './loginUserPopup.module.css';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from 'react-router';
import Loading2 from '../../pages/loading/loading2';
import { useAuth } from '../../context/AuthContext';
import ProviderServices from '../../services/provider';

export default function LoginProviderPopup({ open, close }) {

    const navigate = useNavigate();
    const [providerLogin, setProviderLogin] = useState({});
    const [error, setError] = useState(null);

    const { login , loading2 } = useAuth();
    const {} = ProviderServices()

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;

        // Converte o email para minúsculas
        const newValue = name === 'email' ? value.toLowerCase() : value;

        setProviderLogin({
            ...providerLogin,
            [name]: newValue
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {

            const result = await login(providerLogin.email, providerLogin.password);

            close();
            
            
            if (result.tipo_usuario === 'prestador') {
                 navigate('/providerPerfil');
            } else {
                
                 navigate('/userPerfil');
            }

        } catch (err) {

            console.error('Erro de login:', err);

            if (err.detail) {
                setError(err.detail);
            } else {
                setError('Falha no login. Verifique suas credenciais.');
            }
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
                        {loading2 ? <Loading2 /> :
                            <>
                                <h3>Acesse Sua Conta</h3>
                                <p>Entre com email e senha para ter acesso a sua conta</p>

                                <form onSubmit={handleSubmit}>
                                    <input onChange={handleChangeLogin} name='email' type="email" placeholder='Email' required />
                                    <input onChange={handleChangeLogin} name='password' type="password" placeholder='Senha' required />

                                    {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}

                                    <button type='submit'>Entrar</button>

                                    <a href="#">Esqueceu a senha?</a>
                                </form>
                            </>
                        }


                    </div>

                    <div className={styles.popupFooter}>
                        <button onClick={() => navigate("/providerRegistration")}>Não Tem Uma Conta? Cadastre-se</button>
                    </div>
                </div>

            </Dialog>
        </>
    )
}
