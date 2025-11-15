import styles from './Registration.module.css';

export default function UserRegistration () {
    return(
        <div className={styles.userRegistrationContainer}>
           <div className={styles.registrationForm}>
                <h5>A um click da solução do seu problema.</h5>
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
                    <input type="email" placeholder="Email" required />
                    <input type="email" placeholder="Confirme seu Email" required />
                    <input type="password" placeholder="Senha" required />
                    <input type="password" placeholder="Confirme a Senha" required />
                    <button type="submit">Cadastrar</button>
                </form>
           </div>

           <div className={styles.registrationImage}>
                <img src="/img/registration/registrationUser.png" alt="Imagem de cadastro de usuário" />
           </div>
        </div>
    )
}