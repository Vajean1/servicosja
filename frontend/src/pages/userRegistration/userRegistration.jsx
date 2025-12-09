// components/UserRegistration.js

import { useState, useEffect, useCallback } from 'react';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';
import styles from './Registration.module.css';
import UserServices from '../../services/user';
import Loading from '../loading/loading';
import Loading2 from '../loading/loading2'; // 👈 NOVO: Componente para Mobile Loading
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hook/useIsMobile';// 👈 NOVO: Hook para detecção de tela

// --- Funções Auxiliares (Não Mudaram) ---
const cleanNonNumeric = (value) => {
    return value ? value.replace(/[^0-9]/g, '') : '';
};

const getErrorMessage = (formErrors, fieldName) => {
    if (formErrors[fieldName] && Array.isArray(formErrors[fieldName]) && formErrors[fieldName].length > 0) {
        return formErrors[fieldName][0];
    }
    return null;
};

const caseSensitiveFields = ['password', 'password2', 'genero']; // MOVIDO PARA FORA

// ----------------------------------------


export default function UserRegistration() {
    // 💡 Hooks e Variáveis
    const navigate = useNavigate(); 
    const { setAuthData } = useAuth();
    const isMobile = useIsMobile(); // 👈 Utilizando o hook para detectar se é mobile
    
    const [formDataUser, setFormDataUser] = useState({});
    const [formErrors, setFormErrors] = useState({}); 

    const {register , loading} = UserServices();
    
    // const caseSensitiveFields = ['password', 'password2', 'genero']; // MOVIDO PARA FORA

    // --- Handlers ---
    const handleChangeSetDataUser = useCallback((e) => {
        const { name, value } = e.target;
        
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: null 
        }));

        const newValue = caseSensitiveFields.includes(name) 
            ? value 
            : value.toLowerCase(); 
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    }, []);
    
    const handleMaskedInputChange = useCallback((value, masked, e) => {
        const name = e.target.name; 
        
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: null 
        }));

        let valueToSave;
        
        if (name === 'dt_nascimento') {
            valueToSave = value; 
        } else {
            valueToSave = cleanNonNumeric(value);
        }
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: valueToSave
        }));
    }, []);

    const onCPFChange = useCallback((value, mask) => handleMaskedInputChange(value, mask, { target: { name: 'cpf' } }), [handleMaskedInputChange]);
    const onDtNascimentoChange = useCallback((value, mask) => handleMaskedInputChange(value, mask, { target: { name: 'dt_nascimento' } }), [handleMaskedInputChange]);
    const onCEPChange = useCallback((value, mask) => handleMaskedInputChange(value, mask, { target: { name: 'cep' } }), [handleMaskedInputChange]);
    const onTelefoneChange = useCallback((value, mask) => handleMaskedInputChange(value, mask, { target: { name: 'telefone_contato' } }), [handleMaskedInputChange]);
    // ----------------------------------------
    
    // FUNÇÃO PRINCIPAL: Trata o envio do formulário e a navegação
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors({}); 

        register(formDataUser)
            .then((result) => {
                setAuthData(result);
                // 🚀 REDIRECIONAMENTO CORRIGIDO: Usa navigate()
                navigate('/userPerfil'); 
            })
            .catch((errorObject) => {
                console.error('Erros de validação da API:', errorObject);
                if (errorObject && typeof errorObject === 'object') {
                     setFormErrors(errorObject); 
                } else {
                    alert('Ocorreu um erro inesperado. Tente novamente.');
                }
            });
    };
    

    // 💡 NOVO: Lógica de Carregamento Condicional
    if(loading){
        if (isMobile) {
            return <div className={styles.load}><Loading2 /></div> // Carregamento para Mobile
        }
        return <Loading />; // Carregamento para Desktop
    }

    return (
        <div className={styles.userRegistrationContainer}>
            <div className={styles.registrationForm}>
                <h5>A um click da solução do seu problema.</h5>
                <h2>CADASTRE-SE!</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Campo: nome_completo */}
                    {getErrorMessage(formErrors, 'nome_completo') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'nome_completo')}</p>
                    )}
                    <input 
                        type="text" 
                        placeholder="Nome Completo" 
                        name='nome_completo' 
                        onChange={handleChangeSetDataUser} 
                        value={formDataUser.nome_completo || ''} 
                        required 
                    />
                    
                    {getErrorMessage(formErrors, 'cpf') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'cpf')}</p>
                    )}
                    
                    {getErrorMessage(formErrors, 'dt_nascimento') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'dt_nascimento')}</p>
                    )}
                    
                    <div className={styles.input50}>
                        {/* Campo: cpf */}
                        <IMaskInput
                            mask="000.000.000-00"
                            name='cpf' 
                            onAccept={onCPFChange}
                            value={formDataUser.cpf || ''}
                            placeholder='Cpf'
                            type="text" 
                            required 
                        /> 
                        
                        {/* Campo: dt_nascimento */}
                        <IMaskInput
                            mask="00/00/0000"
                            name='dt_nascimento'
                            onAccept={onDtNascimentoChange}
                            value={formDataUser.dt_nascimento || ''}
                            placeholder='Data de nascimento'
                            type="text"
                            required 
                        /> 
                        
                    </div>
                    
                    {/* Campo: genero */}
                    {getErrorMessage(formErrors, 'genero') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'genero')}</p>
                    )}
                    <select 
                        id="sexo" 
                        name='genero' 
                        value={formDataUser.genero || ''} 
                        onChange={handleChangeSetDataUser} 
                        required
                    >
                        <option value="" disabled hidden>Sexo</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="T">Transgênero</option>
                        <option value="N">Não-binário</option>
                        <option value="P">Prefiro não informar</option>
                    </select>


                    {getErrorMessage(formErrors, 'rua') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'rua')}</p>
                    )}

                    {getErrorMessage(formErrors, 'numero_casa') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'numero_casa')}</p>
                    )}
                    
                    <div className={styles.input50}>
                        
                        {/* Campo: rua */}
                        <input 
                            type="text" 
                            placeholder='Rua' 
                            name='rua' 
                            value={formDataUser.rua || ''}
                            onChange={handleChangeSetDataUser} 
                            required
                        /> 
                        
                        {/* Campo: numero_casa */}
                        <input 
                            type="number" 
                            placeholder='Numero' 
                            name='numero_casa' 
                            value={formDataUser.numero_casa || ''}
                            onChange={handleChangeSetDataUser} 
                            required
                        /> 
                        
                    </div>

                    {/* Campo: cep */}
                    {getErrorMessage(formErrors, 'cep') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'cep')}</p>
                    )}
                    <IMaskInput
                        mask="00000-000"
                        name='cep' 
                        onAccept={onCEPChange}
                        value={formDataUser.cep || ''} 
                        placeholder='Cep'
                        type="text" 
                        required 
                    /> 
                    
                    {/* Campo: telefone_contato */}
                    {getErrorMessage(formErrors, 'telefone_contato') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'telefone_contato')}</p>
                    )}
                    <IMaskInput
                        mask={['(00) 0000-0000', '(00) 00000-0000']}
                        name='telefone_contato' 
                        onAccept={onTelefoneChange}
                        value={formDataUser.telefone_contato || ''} 
                        placeholder='Telefone'
                        type="tel" 
                        required 
                    /> 
                    
                    {/* Campo: email */}
                    {getErrorMessage(formErrors, 'email') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'email')}</p>
                    )}
                    <input type="email" placeholder="Email" name='email' onChange={handleChangeSetDataUser} value={formDataUser.email || ''} required />
                    
                    {/* Campo: password */}
                    {getErrorMessage(formErrors, 'password') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'password')}</p>
                    )}
                    <input type="password" placeholder="Senha" name='password' onChange={handleChangeSetDataUser} value={formDataUser.password || ''} required />
                    
                    {/* Campo: password2 */}
                    {getErrorMessage(formErrors, 'password2') && (
                        <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'password2')}</p>
                    )}
                    <input type="password" placeholder="Confirme a Senha" name='password2' onChange={handleChangeSetDataUser} value={formDataUser.password2 || ''} required />
                    
                    <button type="submit">Cadastrar</button>
                </form>
            </div>

            <div className={styles.registrationImage}>
                <img src="/img/registration/registrationUser.png" alt="Imagem de cadastro de usuário" />
            </div>
        </div>
    );
}
