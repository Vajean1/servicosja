import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './Registration.module.css';

export default function ProviderRegistration() {

    // Mantendo o estado 'categoria' para controlar as opções de 'servico'
    const [categoria, setCategoria] = useState('');

    // Iniciando formDataProvider como um objeto vazio para evitar o erro de 'null'
    // ao tentar desestruturá-lo no handleChangeSetDataProvider.
    const [formDataProvider, setFormDataProvider] = useState({}); 

    const handleChangeSetDataProvider = (e) => {
        const { name, value } = e.target;
        
        // Se o campo for a 'categoria', também atualiza o estado 'categoria'
        if (name === 'categoria') {
            setCategoria(value);
            
            // Opcional: Quando a categoria muda, você pode querer resetar o campo 'servico'
            // para a opção padrão, garantindo que não haja um valor de serviço antigo inválido.
            setFormDataProvider(prevData => ({
                ...prevData,
                [name]: value,
                'servico': '' // Reseta o serviço quando a categoria muda
            }));
        } else {
            // Para todos os outros campos, incluindo o 'servico' e os outros inputs
            setFormDataProvider(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    }
    
    console.log(formDataProvider);
    
    // NOTA IMPORTANTE:
    // O select de 'sexo' e 'horario' precisam do 'onChange' para funcionar!
    // O select de 'categoria' precisa do 'onChange' e do 'value' controlado para atualizar o 'servico'!
    // O select de 'servico' precisa do 'onChange' e do 'value' controlado para setar o valor no formDataProvider!

    return (
        <div className={styles.userRegistrationContainer}>
            <div className={styles.registrationForm}>
                <h5>Seu próximo cliente está a um click.</h5>
                <h2>CADASTRE-SE!</h2>
                <form>
                    <input 
                        type="text" 
                        placeholder="Nome Completo" 
                        name='name'
                        onChange={handleChangeSetDataProvider}
                        required 
                    />
                    
                    <div className={styles.input50}>
                        {/* CPF: 000.000.000-00 */}
                        <IMaskInput
                            mask="000.000.000-00"
                            name='cpf'
                            placeholder='Cpf'
                            type="text" 
                            onChange={handleChangeSetDataProvider}
                            required 
                        /> 
                        
                        {/* DATA DE NASCIMENTO: 00/00/0000 */}
                        <IMaskInput
                            mask="00/00/0000"
                            name='dataNascimento'
                            placeholder='Data de nascimento'
                            onChange={handleChangeSetDataProvider}
                            type="text"
                            required 
                        /> 
                    </div>
                    
                    {/* SELECT DE SEXO CONTROLADO - ADICIONADO onChange e value */}
                    <select 
                        id="sexo" 
                        name='sexo'
                        value={formDataProvider.sexo || ''} // Controla o valor com base no estado
                        onChange={handleChangeSetDataProvider} // Adicionado o handler
                        required
                    >
                        {/* A opção inicial deve ter value="" para corresponder ao estado inicial '' */}
                        <option value="" disabled hidden>Sexo</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="transgenero">Transgênero</option>
                        <option value="nao-binario">Não-binário</option>
                        <option value="nao-informado">Prefiro não informar</option>
                    </select>
                    
                    <input 
                        type="text" 
                        placeholder='Endereço' 
                        name='endereco'
                        onChange={handleChangeSetDataProvider}
                        required
                    /> 
                    
                    {/* CEP: 00000-000 */}
                    <IMaskInput
                        mask="00000-000"
                        name='cep'
                        onChange={handleChangeSetDataProvider}
                        placeholder='Cep'
                        type="text" 
                        required 
                    /> 
                    
                    {/* TELEFONE: (00) 0000-0000 ou (00) 00000-0000 */}
                    <IMaskInput
                        mask={['(00) 0000-0000', '(00) 00000-0000']}
                        name='telefone'
                        placeholder='Telefone'
                        onChange={handleChangeSetDataProvider}
                        type="tel" 
                        required 
                    /> 
                    
                    <div className={styles.input50}>
                        {/* SELECT DE CATEGORIA CONTROLADO - ADICIONADO name, onChange e value */}
                        <select 
                            id="categoria" 
                            name='categoria' // Adicionado o name
                            value={categoria} // O valor agora é controlado pelo estado 'categoria'
                            onChange={handleChangeSetDataProvider} // Adicionado o handler
                            required
                        >
                            <option value="" disabled hidden>Categoria do serviço</option>
                            <option value="beleza-bem-estar">Beleza e bem-estar</option>
                            <option value="cuidado-pessoal">Cuidado Pessoal</option>
                            <option value="lazer-eventos">Lazer e eventos</option>
                            <option value="limpeza-organizacao">Limpeza e organização</option>
                            <option value="manutencao-reparos">Manutenção e reparos</option>
                            <option value="reforma-construcao">Reforma e construção</option>
                            <option value="solucoes-profissionais">Soluções Profissionais</option>
                            <option value="transporte">Transporte</option>
                        </select>

                        {/* SELECT DE SERVIÇO CONTROLADO - ADICIONADO name, onChange e value */}
                        <select 
                            id="servico" 
                            name='servico' // Adicionado o name
                            value={formDataProvider.servico || ''} // Controla o valor pelo estado
                            onChange={handleChangeSetDataProvider} // Adicionado o handler
                            required
                        >
                            <option value="" disabled hidden>Serviço</option>
                            {categoria === '' && (
                                <option value="" disabled>Selecione uma categoria</option>
                            )
                            }

                            {categoria === 'beleza-bem-estar' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="alongamento-unha">Alongamento de unha</option> 
                                    <option value="depilador">Depilador/Epilador(a)</option> 
                                    <option value="manicure">Manicure/Pedicure</option>
                                    <option value="alongamento-cilios">Alongamento de cílios</option>
                                    <option value="megahair">Especialista em Megahair</option>
                                    <option value="massagista">Massagista</option>
                                    <option value="barbeiro">Barbeiro(a)</option>
                                    <option value="cabeleireiro">Cabeleireiro(a)</option>
                                    <option value="micropigmentador">Micropigmentador(a)</option>
                                    <option value="penteados">Especialista em penteados</option>
                                    <option value="podogolo">Podógolo</option>
                                    <option value="colourista">Colourista</option>
                                    <option value="esteticista">Esteticista</option>
                                    <option value="visagista">Visagista</option>
                                    <option value="trancista">Trancista</option>
                                    <option value="designer-sobrancelha">Designer de sobrancelha</option>
                                    <option value="lash-designer">Lash Designer </option>
                                    <option value="maquiador">Maquiador(a)</option>
                                </> 
                            )}

                            {categoria === 'transporte' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="caminhao">Aluguel de caminhão</option>
                                    <option value="frete">Serviço de frete</option>
                                    <option value="motoboy">Motoboy</option>
                                    <option value="carro">Aluguel de carro/van</option>
                                    <option value="mudanca-comercio">Mudança comercial</option>
                                    <option value="mudanca-residencia">Mudança residêncial</option>
                                    <option value="guincho">Guincho</option>
                                    <option value="animais">Transporte de animais</option>
                                </>
                            )}

                            { categoria === 'solucoes-profissionais' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="professor">Professor</option>
                                    <option value="tradutor">Redator/Tradutor</option>
                                    <option value="design-grafico">Design gráfico</option>
                                    <option value="desenvolvimento-web">Desenvolvimento web</option>
                                    <option value="editor-video">Editor de vídeo</option>
                                    <option value="tec-informatica">Tec. informatica/celular</option>
                                    <option value="social-media">Social media</option>
                                    <option value="web-designer">Web designer</option>
                                    <option value="ilustrador-digital">Ilustrador digital</option>
                                </>
                            )}

                            {categoria === 'manutencao-reparos' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="borracheiro">Borracheiro</option>
                                    <option value="eletricista">Eletricista</option>
                                    <option value="instalacao-bomba-caixa">Instalação de bomba e caixa d'água</option>
                                    <option value="chaveiro">Chaveiro</option>
                                    <option value="encanador">Encanador</option>
                                    <option value="conserto-armarios">Conserto de armários</option>
                                    <option value="envernizador-moveis">Envernizador de móveis</option>
                                    <option value="manutencao-ventilador">Manutenção de ventilador</option>
                                    <option value="conserto-eletrodomesticos">Conserto de eletrodomésticos</option>
                                    <option value="instalacao-ar-condicionado">Instalação de ar-condicionado</option>
                                    <option value="marceneiro">Marceneiro</option>
                                    <option value="mecanico">Mecânico</option>
                                    <option value="conserto-fogao-forno">Conserto de fogões e fornos</option>
                                    <option value="instalacao-cameras">Instalação de câmeras</option>
                                    <option value="montador-moveis">Montador de móveis</option>
                                    <option value="instalacao-tv-hometheater">Instalação de TV e Home theater</option>
                                    <option value="pintor">Pintor</option>
                                    <option value="conserto-maquina-lavar">Conserto de máquina de lavar</option>
                                    <option value="tec-refrigeracao">Téc. em refrigeração</option>
                                    <option value="vedacao">Vedação</option>
                                </>
                            )}

                            {categoria === 'lazer-eventos' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="aluguel-brinquedos">Aluguel de brinquedos</option>
                                    <option value="decorador-festas">Decorador de festas</option>
                                    <option value="aluguel-eletronicos">Aluguel de equi. eletrônicos</option>
                                    <option value="dj-musico">DJ/Músico</option>
                                    <option value="fotografo">Fotógrafo</option>
                                    <option value="aluguel-mesas-cadeiras">Aluguel de mesas e cadeiras</option>
                                    <option value="garcom-barman">Garçom/Barman</option>
                                    <option value="aluguel-fantasias">Aluguel de fantasias</option>
                                    <option value="montador-eventos">Montador de eventos</option>
                                    <option value="animador-palhaco">Animador/palhaço</option>
                                    <option value="sonoplastia">Sonoplastia/Téc. de som</option>
                                    <option value="buffet">Buffet</option>
                                </>
                            )}

                            {categoria === 'cuidado-pessoal' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="acupunturista">Acupunturista</option>
                                    <option value="fisioterapeuta-domiciliar">Fisioterapeuta domiciliar</option>
                                    <option value="aromaterapeuta">Aromaterapeuta</option>
                                    <option value="personal-trainer">Personal trainer</option>
                                    <option value="auriculoterapeuta">Auriculoterapeuta</option>
                                    <option value="quiropraxista">Quiropraxista</option>
                                    <option value="cuidador-idosos">Cuidador(a) de idosos</option>
                                    <option value="ventosaterapeuta">Ventosaterapeuta</option>
                                    <option value="enfermeiro-particular">Enfermeiro(a) particular</option>
                                </>
                            )}

                            {categoria === 'limpeza-organizacao' && (
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="dedetizador">Dedetizador</option>
                                    <option value="limpeza-estofados-colchoes">Limpeza de estofados e colchões</option>
                                    <option value="diarista">Diarista</option>
                                    <option value="enceramento-pisos">Enceramento de pisos</option>
                                    <option value="limpeza-pos-obra">Limpeza pós-obra</option>
                                    <option value="limpeza-ar-condicionado">Limpeza de ar-condicionado</option>
                                    <option value="limpeza-telhado">Limpeza de telhado</option>
                                    <option value="limpeza-caixa-dagua">Limpeza de caixa d'água</option>
                                    <option value="limpeza-vidro">Limpeza de vidro</option>
                                    <option value="limpeza-carpete">Limpeza de carpete</option>
                                    <option value="tratamento-pragas">Tratamento de pragas</option>
                                    <option value="zelador">Zelador</option>
                                </>
                            )}

                            {categoria === 'reforma-construcao' && ( 
                                <>
                                    <option value="" disabled hidden>Serviço</option>
                                    <option value="aplicacao-massa-corrida">Aplicação de massa corrida</option>
                                    <option value="instalacao-bancadas-pias">Instalação de bancadas e pias</option>
                                    <option value="azulejista">Azulejista</option>
                                    <option value="instalacao-drywall">Instalação de Drywall</option>
                                    <option value="calheiro">Calheiro</option>
                                    <option value="instalacao-portas-janelas">Instalação de portas e janelas</option>
                                    <option value="colocacao-forro-pvc">Colocação de forro de PVC</option>
                                    <option value="instalacao-telhados">Instalação de telhados</option>
                                    <option value="fundacao-alvenaria">Fundação e alvenaria</option>
                                    <option value="pedreiro">Pedreiro</option>
                                    <option value="gesseiro">Gesseiro</option>
                                    <option value="reforma-fachadas">Reforma de fachadas</option>
                                    <option value="impermeabilizacao-lajes-paredes">Impermeabilização de lajes e paredes</option>
                                    <option value="reforma-pisos">Reforma de pisos</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className={styles.select50}>
                        {/* SELECT DE HORÁRIO CONTROLADO - ADICIONADO name e value */}
                        <select 
                            id="horario" 
                            name='horario' // Adicionado o name
                            value={formDataProvider.horario || ''} // Controla o valor com base no estado
                            onChange={handleChangeSetDataProvider}
                            required
                        >
                            <option value="" disabled hidden>Disponibilidade 24H</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                            
                        </select>
                    </div>
                    
                    {/* ... campos de Email e Senha (já estão corretos) ... */}
                    <input type="email" placeholder="Email" name='email' onChange={handleChangeSetDataProvider} required />
                    <input type="password" placeholder="Senha" onChange={handleChangeSetDataProvider} name='password' required />
                    <input type="password" placeholder="Confirme a Senha" onChange={handleChangeSetDataProvider} name='confirmPassword' required />
                    <button type="submit">Cadastrar</button>
                </form>
            </div>

            <div className={styles.registrationImage}>
                <img src="/img/registration/registrationProvider.jpeg" alt="Imagem de cadastro de usuário" />
            </div>
        </div>
    );
}