import  { useState } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './Registration.module.css';

export default function UserRegistration() {
    const [formDataUser, setFormDataUser] = useState({});
    

    const caseSensitiveFields = ['password', 'confirmPassword'];

    const handleChangeSetDataUser = (e) => {
        const { name, value } = e.target;
        
        const newValue = caseSensitiveFields.includes(name) 
            ? value 
            : value.toLowerCase(); 
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };
    
    const handleMaskedInputChange = (value, mask, e) => {
        
        const name = e.target.name; 
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

   

    return (
        <div className={styles.userRegistrationContainer}>
            <div className={styles.registrationForm}>
                <h5>A um click da solução do seu problema.</h5>
                <h2>CADASTRE-SE!</h2>
                <form>
                    
                    <input 
                        type="text" 
                        placeholder="Nome Completo" 
                        name='nome' 
                        onChange={handleChangeSetDataUser} 
                        value={formDataUser.nome || ''} 
                        required 
                    />
                    
                    <div className={styles.input50}>
                        
                        <IMaskInput
                            mask="000.000.000-00"
                            name='cpf' 
                            value={formDataUser.cpf || ''}
                            onAccept={handleMaskedInputChange} 
                            placeholder='Cpf'
                            type="text" 
                            required 
                        /> 
                        
                        
                        <IMaskInput
                            mask="00/00/0000"
                            name='dataNascimento'
                            value={formDataUser.dataNascimento || ''}
                            onAccept={handleMaskedInputChange} 
                            placeholder='Data de nascimento'
                            type="text"
                            required 
                        /> 
                    </div>
                    
                    
                    <select 
                        id="sexo" 
                        name='sexo' 
                        value={formDataUser.sexo || ''} 
                        onChange={handleChangeSetDataUser} 
                        required
                    >
                        <option value="" disabled hidden>Sexo</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="nao-informado">Prefiro não informar</option>
                    </select>

                    <div className={styles.input50}>
                    
                        <input 
                            type="text" 
                            placeholder='Rua' 
                            name='rua' 
                            value={formDataUser.rua || ''}
                            onChange={handleChangeSetDataUser} 
                            required
                        /> 

                         <input 
                            type="number" 
                            placeholder='Numero' 
                            name='number' 
                             value={formDataUser.number || ''}
                            onChange={handleChangeSetDataUser} 
                            required
                        /> 
                    
                    </div>
                    <IMaskInput
                        mask="00000-000"
                        name='cep' 
                        value={formDataUser.cep || ''} 
                        onAccept={handleMaskedInputChange} 
                        placeholder='Cep'
                        type="text" 
                        required 
                    /> 
                    
                    
                    <IMaskInput
                        mask={['(00) 0000-0000', '(00) 00000-0000']}
                        name='telefone' 
                        value={formDataUser.telefone || ''} 
                        onAccept={handleMaskedInputChange} 
                        placeholder='Telefone'
                        type="tel" 
                        required 
                    /> 
                    
                    
                    <input type="email" placeholder="Email" name='email' onChange={handleChangeSetDataUser} value={formDataUser.email || ''} required />
                    <input type="password" placeholder="Senha" name='password' onChange={handleChangeSetDataUser} value={formDataUser.password || ''} required />
                    <input type="password" placeholder="Confirme a Senha" name='confirmPassword' onChange={handleChangeSetDataUser} value={formDataUser.confirmPassword || ''} required />
                    
                    <button type="submit">Cadastrar</button>
                </form>
            </div>

            <div className={styles.registrationImage}>
                <img src="/img/registration/registrationUser.png" alt="Imagem de cadastro de usuário" />
            </div>
        </div>
    );
}