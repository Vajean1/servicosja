import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './Registration.module.css';

export default function UserRegistration() {
    // 1. Estado único para todos os dados do formulário
    const [formDataUser, setFormDataUser] = useState({});

    // Função de handler para Inputs regulares e Selects
    const handleChangeSetDataUser = (e) => {
        const { name, value } = e.target;
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Função de handler para IMaskInput (usa onAccept)
    const handleMaskedInputChange = (value, mask, e) => {
        
        const name = e.target.name; 
        
        setFormDataUser(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    console.log(formDataUser);

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
                            name='cpf' // Adicionado name
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
                    
                    {/* ENDEREÇO */}
                    <input 
                        type="text" 
                        placeholder='Endereço' 
                        name='endereco' 
                        value={formDataUser.endereco || ''} 
                        onChange={handleChangeSetDataUser} 
                        required
                    /> 
                    
                    {/* CEP: 00000-000 (IMaskInput) */}
                    <IMaskInput
                        mask="00000-000"
                        name='cep' // Adicionado name
                        value={formDataUser.cep || ''} // Valor controlado
                        onAccept={handleMaskedInputChange} // Usando onAccept
                        placeholder='Cep'
                        type="text" 
                        required 
                    /> 
                    
                    {/* TELEFONE: (00) 00000-0000 (IMaskInput Dinâmico) */}
                    <IMaskInput
                        mask={['(00) 0000-0000', '(00) 00000-0000']}
                        name='telefone' // Adicionado name
                        value={formDataUser.telefone || ''} // Valor controlado
                        onAccept={handleMaskedInputChange} // Usando onAccept
                        placeholder='Telefone'
                        type="tel" 
                        required 
                    /> 
                    
                    {/* CAMPOS DE LOGIN */}
                    <input type="email" placeholder="Email" name='email' onChange={handleChangeSetDataUser} value={formDataUser.email || ''} required />
                    <input type="email" placeholder="Confirme seu Email" name='confirmEmail' onChange={handleChangeSetDataUser} value={formDataUser.confirmEmail || ''} required />
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