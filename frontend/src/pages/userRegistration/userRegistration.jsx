import { useState } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './Registration.module.css';
import UserServices from '../../services/user';
import Loading from '../loading/loading';

// Função auxiliar para remover caracteres não numéricos
const cleanNonNumeric = (value) => {
    return value ? value.replace(/[^0-9]/g, '') : '';
};

// Função auxiliar para obter a primeira mensagem de erro para um campo
const getErrorMessage = (formErrors, fieldName) => {
    if (formErrors[fieldName] && Array.isArray(formErrors[fieldName]) && formErrors[fieldName].length > 0) {
        return formErrors[fieldName][0];
    }
    return null;
};

export default function UserRegistration() {
    const [formDataUser, setFormDataUser] = useState({});
    
    // NOVO ESTADO: Armazena os erros retornados pela API
    const [formErrors, setFormErrors] = useState({}); 

    const {register , loading} = UserServices()
    
    const caseSensitiveFields = ['password', 'password2', 'genero'];

    const handleChangeSetDataUser = (e) => {
        const { name, value } = e.target;
        
        // Limpa o erro para o campo atual ao iniciar a edição
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: null 
        }));

        // Mantém a lógica de conversão para minúsculas para campos não mascarados
        const newValue = caseSensitiveFields.includes(name) 
            ? value 
            : value.toLowerCase(); 
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };
    
    // Função ajustada para lidar com IMaskInput
    const handleMaskedInputChange = (value, masked, e) => {
        const name = e.target.name; 
        
        // Limpa o erro para o campo atual
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: null 
        }));

        let valueToSave;
        
        if (name === 'dt_nascimento') {
            // Salva o valor com máscara (DD/MM/AAAA)
            valueToSave = value; 
        } else {
            // Para CPF, CEP e Telefone, salva apenas os dígitos (unmaskedValue)
            valueToSave = cleanNonNumeric(value);
        }
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: valueToSave
        }));
    };
    
    // NOVA FUNÇÃO: Trata o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors({}); // Limpa erros antigos antes de enviar

        register(formDataUser)
            .then((result) => {
                // Lógica de sucesso (ex: redirecionar, mostrar mensagem)
                console.log('Cadastro realizado com sucesso!', result);
            })
            .catch((errorObject) => {
                // Lógica de erro: Captura o objeto de erros da API
                console.error('Erros de validação da API:', errorObject);
                setFormErrors(errorObject); // Salva os erros no estado
            });
    };
    

    if(loading){
        return(
            <Loading/>
        )
    }

    return (
        <div className={styles.userRegistrationContainer}>
            <div className={styles.registrationForm}>
                <h5>A um click da solução do seu problema.</h5>
                <h2>CADASTRE-SE!</h2>
                {/* 1. O formulário agora usa handleSubmit */}
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
                    
                    <div className={styles.input50}>
                        {/* Campo: cpf */}
                        {getErrorMessage(formErrors, 'cpf') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'cpf')}</p>
                        )}
                        <IMaskInput
                            mask="000.000.000-00"
                            name='cpf' 
                            // Propagamos 'e.target.name' via objeto para handleMaskedInputChange
                            onAccept={(value, mask, e) => handleMaskedInputChange(value, mask, { target: { name: 'cpf' } })}
                            value={formDataUser.cpf || ''}
                            placeholder='Cpf'
                            type="text" 
                            required 
                        /> 
                        
                        {/* Campo: dt_nascimento */}
                        {getErrorMessage(formErrors, 'dt_nascimento') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'dt_nascimento')}</p>
                        )}
                        <IMaskInput
                            mask="00/00/0000"
                            name='dt_nascimento'
                            onAccept={(value, mask, e) => handleMaskedInputChange(value, mask, { target: { name: 'dt_nascimento' } })} 
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
                        <option value="nao-informado">Prefiro não informar</option>
                    </select>

                    <div className={styles.input50}>
                        {/* Campo: rua */}
                        {getErrorMessage(formErrors, 'rua') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'rua')}</p>
                        )}
                        <input 
                            type="text" 
                            placeholder='Rua' 
                            name='rua' 
                            value={formDataUser.rua || ''}
                            onChange={handleChangeSetDataUser} 
                            required
                        /> 

                        {/* Campo: numero_casa */}
                        {getErrorMessage(formErrors, 'numero_casa') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'numero_casa')}</p>
                        )}
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
                        onAccept={(value, mask, e) => handleMaskedInputChange(value, mask, { target: { name: 'cep' } })}
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
                        onAccept={(value, mask, e) => handleMaskedInputChange(value, mask, { target: { name: 'telefone_contato' } })}
                        value={formDataUser.telefone_contato || ''} 
                        placeholder='telefone_contato'
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
                    
                    {/* O botão usa type="submit" para acionar o form.onSubmit */}
                    <button type="submit">Cadastrar</button>
                </form>
            </div>

            <div className={styles.registrationImage}>
                <img src="/img/registration/registrationUser.png" alt="Imagem de cadastro de usuário" />
            </div>
        </div>
    );
}