import { useNavigate } from 'react-router';
import styles from './loginUserPopup.module.css'
import { Dialog } from '@mui/material'
import { IoExitOutline } from "react-icons/io5";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginUserPopup({ open, close }) {

    const [userLogin, setUserLogin] = useState({});
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;

        const newValue = name === 'email' ? value.toLowerCase() : value;

        setUserLogin({
            ...userLogin,
            [name]: newValue
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const userData = await login(userLogin.email, userLogin.password);
            close();
            
            // Redirect based on user type
            if (userData.tipo_usuario === 'prestador') {
                navigate('/providerPerfil');
            } else {
                navigate('/userPerfil');
            }

        } catch (err) {
            console.error("Erro no login:", err);
            // Handle specific API error messages if available
            if (err.detail) {
                 setError(err.detail);
            } else {
                 setError("Falha no login. Verifique suas credenciais.");
            }
        }
    }

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

                        <form onSubmit={handleSubmit}>

                            <input
                                onChange={handleChangeLogin}
                                type="email"
                                placeholder='Email'
                                name="email"
                                required
                            />

                            <input
                                onChange={handleChangeLogin}
                                type="password"
                                placeholder='Senha'
                                name="password"
                                required
                            />

                            {error && <p style={{ color: 'red', margin: '10px 0', fontSize: '14px' }}>{error}</p>}

                            <button
                                type='submit'
                            >
                                Entrar
                            </button>
                            <a href="#">Esqueceu a senha?</a>
                        </form>

                    </div>

                    <div className={styles.popupFooter}>
                        <button onClick={() => navigate("/userRegistration")}>Não Tem Uma Conta? Cadastre-se</button>
                    </div>
                </div>

            </Dialog>
        </>
    )
}
