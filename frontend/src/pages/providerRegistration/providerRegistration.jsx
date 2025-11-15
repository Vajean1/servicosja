import styles from './Registration.module.css';

export default function ProviderRegistration () {
    return(
        <div className={styles.userRegistrationContainer}>
           <div className={styles.registrationForm}>
                <h5>Seu próximo cliente está a um click.</h5>
                <h2>CADASTRE-SE!</h2>
                <form>
                    <input type="text" placeholder="Nome Completo" required />
                    <div className={styles.input50}>
                        <input type="text " placeholder='Cpf' /> 
                        <input type="data " placeholder='Data de nascimento' /> 
                    </div>
                    <input type="text " placeholder='Sexo' /> 
                    <input type="text " placeholder='Endereço' /> 
                    <input type="text " placeholder='Cep' /> 
                    <input type="tel " placeholder='Telefone' /> 
                     <div className={styles.input50}>
                        <input type="text " placeholder='Tipo de serviço' /> 
                        <input type="text " placeholder='Categoria do serviço' /> 
                    </div>

                    <div className={styles.input50}>
                        <input type="time " placeholder='Disponibilidade de horario' /> 
                    </div>
                    
                    <input type="email" placeholder="Email" required />
                    <input type="email" placeholder="Confirme seu Email" required />
                    <input type="password" placeholder="Senha" required />
                    <input type="password" placeholder="Confirme a Senha" required />
                    <button type="submit">Cadastrar</button>
                </form>
           </div>

           <div className={styles.registrationImage}>
                <img src="/img/registration/registrationProvider.jpeg" alt="Imagem de cadastro de usuário" />
           </div>
        </div>
    )
}