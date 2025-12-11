import { useState, useEffect, useCallback } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './Registration.module.css';
import ProviderServices from '../../services/provider';
import Loading from '../loading/loading';
import Loading2 from '../loading/loading2'; 
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hook/useIsMobile'; 

// --- ARRAYS E FUNÇÕES AUXILIARES ---

const allCategores = [
    { "id": 1, "nome": "Beleza e Bem-estar", "descricao": "Serviços relacionados a Beleza e Bem-estar", "icone": null },
    { "id": 2, "nome": "Cuidado Pessoal", "descricao": "Serviços relacionados a Cuidado Pessoal", "icone": null },
    { "id": 3, "nome": "Lazer e Eventos", "descricao": "Serviços relacionados a Lazer e Eventos", "icone": null },
    { "id": 4, "nome": "Limpeza e Organização", "descricao": "Serviços relacionados a Limpeza e Organização", "icone": null },
    { "id": 5, "nome": "Manutenção e Reparos", "descricao": "Serviços relacionados a Manutenção e Reparos", "icone": null },
    { "id": 6, "nome": "Reforma e Construção", "descricao": "Serviços relacionados a Reforma e Construção", "icone": null },
    { "id": 7, "nome": "Soluções Profissionais", "descricao": "Serviços relacionados a Soluções Profissionais", "icone": null },
    { "id": 8, "nome": "Transporte", "descricao": "Serviços relacionados a Transporte", "icone": null }
];

const allServices = [
    { "id": 1, "nome": "Alongamento de unha", "value": "alongamento-unha", "categoria": "beleza-bem-estar" },
    { "id": 2, "nome": "Depilador/Epilador(a)", "value": "depilador", "categoria": "beleza-bem-estar" },
    { "id": 3, "nome": "Manicure/Pedicure", "value": "manicure", "categoria": "beleza-bem-estar" },
    { "id": 4, "nome": "Alongamento de cílios", "value": "alongamento-cilios", "categoria": "beleza-bem-estar" },
    { "id": 5, "nome": "Especialista em megahair", "value": "megahair", "categoria": "beleza-bem-estar" },
    { "id": 6, "nome": "Massagista", "value": "massagista", "categoria": "beleza-bem-estar" },
    { "id": 7, "nome": "Barbeiro(a)", "value": "barbeiro", "categoria": "beleza-bem-estar" },
    { "id": 8, "nome": "Micropigmentador(a)", "value": "micropigmentador", "categoria": "beleza-bem-estar" },
    { "id": 9, "nome": "Cabeleireiro(a)", "value": "cabeleireiro", "categoria": "beleza-bem-estar" },
    { "id": 10, "nome": "Especialista em penteados", "value": "penteados", "categoria": "beleza-bem-estar" },
    { "id": 11, "nome": "Podólogo", "value": "podogolo", "categoria": "beleza-bem-estar" },
    { "id": 12, "nome": "Colourista", "value": "colourista", "categoria": "beleza-bem-estar" },
    { "id": 13, "nome": "Esteticista", "value": "esteticista", "categoria": "beleza-bem-estar" },
    { "id": 14, "nome": "Trancista", "value": "trancista", "categoria": "beleza-bem-estar" },
    { "id": 15, "nome": "Designer de sobrancelhas", "value": "designer-sobrancelha", "categoria": "beleza-bem-estar" },
    { "id": 16, "nome": "Lash designer", "value": "lash-designer", "categoria": "beleza-bem-estar" },
    { "id": 17, "nome": "Visagista", "value": "visagista", "categoria": "beleza-bem-estar" },
    { "id": 18, "nome": "Maquiador(a)", "value": "maquiador", "categoria": "beleza-bem-estar" },
    { "id": 19, "nome": "Acupunturista", "value": "acupunturista", "categoria": "cuidado-pessoal" },
    { "id": 20, "nome": "Fisioterapeuta domiciliar", "value": "fisioterapeuta-domiciliar", "categoria": "cuidado-pessoal" },
    { "id": 21, "nome": "Aromaterapeuta", "value": "aromaterapeuta", "categoria": "cuidado-pessoal" },
    { "id": 22, "nome": "Personal trainer", "value": "personal-trainer", "categoria": "cuidado-pessoal" },
    { "id": 23, "nome": "Auriculoterapeuta", "value": "auriculoterapeuta", "categoria": "cuidado-pessoal" },
    { "id": 24, "nome": "Quiropraxista", "value": "quiropraxista", "categoria": "cuidado-pessoal" },
    { "id": 25, "nome": "Cuidador(a) de idosos", "value": "cuidador-idosos", "categoria": "cuidado-pessoal" },
    { "id": 26, "nome": "Ventosaterapeuta", "value": "ventosaterapeuta", "categoria": "cuidado-pessoal" },
    { "id": 27, "nome": "Enfermeiro(a) particular", "value": "enfermeiro-particular", "categoria": "cuidado-pessoal" },
    { "id": 28, "nome": "Aluguel de brinquedos", "value": "aluguel-brinquedos", "categoria": "lazer-eventos" },
    { "id": 29, "nome": "Decorador de festas", "value": "decorador-festas", "categoria": "lazer-eventos" },
    { "id": 30, "nome": "Aluguel de equi. eletrônicos", "value": "aluguel-eletronicos", "categoria": "lazer-eventos" },
    { "id": 31, "nome": "DJ/Músico", "value": "dj-musico", "categoria": "lazer-eventos" },
    { "id": 32, "nome": "Fotógrafo", "value": "fotografo", "categoria": "lazer-eventos" },
    { "id": 33, "nome": "Aluguel de mesas e cadeiras", "value": "aluguel-mesas-cadeiras", "categoria": "lazer-eventos" },
    { "id": 34, "nome": "Garçom/Barman", "value": "garcom-barman", "categoria": "lazer-eventos" },
    { "id": 35, "nome": "Aluguel de fantasias", "value": "aluguel-fantasias", "categoria": "lazer-eventos" },
    { "id": 36, "nome": "Montador de eventos", "value": "montador-eventos", "categoria": "lazer-eventos" },
    { "id": 37, "nome": "Animador/palhaço", "value": "animador-palhaco", "categoria": "lazer-eventos" },
    { "id": 38, "nome": "Sonoplastia/Téc. de som", "value": "sonoplastia", "categoria": "lazer-eventos" },
    { "id": 39, "nome": "Buffet", "value": "buffet", "categoria": "lazer-eventos" },
    { "id": 40, "nome": "Dedetizador", "value": "dedetizador", "categoria": "limpeza-organizacao" },
    { "id": 41, "nome": "Limpeza de estofados e colchões", "value": "limpeza-estofados-colchoes", "categoria": "limpeza-organizacao" },
    { "id": 42, "nome": "Diarista", "value": "diarista", "categoria": "limpeza-organizacao" },
    { "id": 43, "nome": "Enceramento de pisos", "value": "enceramento-pisos", "categoria": "limpeza-organizacao" },
    { "id": 44, "nome": "Limpeza pós-obra", "value": "limpeza-pos-obra", "categoria": "limpeza-organizacao" },
    { "id": 45, "nome": "Limpeza de ar-condicionado", "value": "limpeza-ar-condicionado", "categoria": "limpeza-organizacao" },
    { "id": 46, "nome": "Limpeza de telhado", "value": "limpeza-telhado", "categoria": "limpeza-organizacao" },
    { "id": 47, "nome": "Limpeza de caixa d'água", "value": "limpeza-caixa-dagua", "categoria": "limpeza-organizacao" },
    { "id": 48, "nome": "Limpeza de vidro", "value": "limpeza-vidro", "categoria": "limpeza-organizacao" },
    { "id": 49, "nome": "Limpeza de carpete", "value": "limpeza-carpete", "categoria": "limpeza-organizacao" },
    { "id": 50, "nome": "Tratamento de pragas", "value": "tratamento-pragas", "categoria": "limpeza-organizacao" },
    { "id": 51, "nome": "Zelador", "value": "zelador", "categoria": "limpeza-organizacao" },
    { "id": 52, "nome": "Borracheiro", "value": "borracheiro", "categoria": "manutencao-reparos" },
    { "id": 53, "nome": "Eletricista", "value": "eletricista", "categoria": "manutencao-reparos" },
    { "id": 54, "nome": "Instalação de bomba e caixa d'água", "value": "instalacao-bomba-caixa", "categoria": "manutencao-reparos" },
    { "id": 55, "nome": "Chaveiro", "value": "chaveiro", "categoria": "manutencao-reparos" },
    { "id": 56, "nome": "Encanador", "value": "encanador", "categoria": "manutencao-reparos" },
    { "id": 57, "nome": "Conserto de armários", "value": "conserto-armarios", "categoria": "manutencao-reparos" },
    { "id": 58, "nome": "Envernizador de móveis", "value": "envernizador-moveis", "categoria": "manutencao-reparos" },
    { "id": 59, "nome": "Manutenção de ventilador", "value": "manutencao-ventilador", "categoria": "manutencao-reparos" },
    { "id": 60, "nome": "Conserto de eletrodomésticos", "value": "conserto-eletrodomesticos", "categoria": "manutencao-reparos" },
    { "id": 61, "nome": "Instalação de ar-condicionado", "value": "instalacao-ar-condicionado", "categoria": "manutencao-reparos" },
    { "id": 62, "nome": "Marceneiro", "value": "marceneiro", "categoria": "manutencao-reparos" },
    { "id": 63, "nome": "Mecânico", "value": "mecanico", "categoria": "manutencao-reparos" },
    { "id": 64, "nome": "Conserto de fogões e fornos", "value": "conserto-fogao-forno", "categoria": "manutencao-reparos" },
    { "id": 65, "nome": "Instalação de câmeras", "value": "instalacao-cameras", "categoria": "manutencao-reparos" },
    { "id": 66, "nome": "Montador de móveis", "value": "montador-moveis", "categoria": "manutencao-reparos" },
    { "id": 67, "nome": "Instalação de TV e Home theater", "value": "instalacao-tv-hometheater", "categoria": "manutencao-reparos" },
    { "id": 68, "nome": "Pintor", "value": "pintor", "categoria": "manutencao-reparos" },
    { "id": 69, "nome": "Conserto de máquina de lavar", "value": "conserto-maquina-lavar", "categoria": "manutencao-reparos" },
    { "id": 70, "nome": "Téc. em refrigeração", "value": "tec-refrigeracao", "categoria": "manutencao-reparos" },
    { "id": 71, "nome": "Vedação", "value": "vedacao", "categoria": "manutencao-reparos" },
    { "id": 72, "nome": "Aplicação de massa corrida", "value": "aplicacao-massa-corrida", "categoria": "reforma-construcao" },
    { "id": 73, "nome": "Instalação de bancadas e pias", "value": "instalacao-bancadas-pias", "categoria": "reforma-construcao" },
    { "id": 74, "nome": "Azulejista", "value": "azulejista", "categoria": "reforma-construcao" },
    { "id": 75, "nome": "Instalação de Drywall", "value": "instalacao-drywall", "categoria": "reforma-construcao" },
    { "id": 76, "nome": "Calheiro", "value": "calheiro", "categoria": "reforma-construcao" },
    { "id": 77, "nome": "Instalação de portas e janelas", "value": "instalacao-portas-janelas", "categoria": "reforma-construcao" },
    { "id": 78, "nome": "Colocação de forro de PVC", "value": "colocacao-forro-pvc", "categoria": "reforma-construcao" },
    { "id": 79, "nome": "Instalação de telhados", "value": "instalacao-telhados", "categoria": "reforma-construcao" },
    { "id": 80, "nome": "Fundação e alvenaria", "value": "fundacao-alvenaria", "categoria": "reforma-construcao" },
    { "id": 81, "nome": "Pedreiro", "value": "pedreiro", "categoria": "reforma-construcao" },
    { "id": 82, "nome": "Gesseiro", "value": "gesseiro", "categoria": "reforma-construcao" },
    { "id": 83, "nome": "Reforma de fachadas", "value": "reforma-fachadas", "categoria": "reforma-construcao" },
    { "id": 84, "nome": "Impermeabilização de lajes e paredes", "value": "impermeabilizacao-lajes-paredes", "categoria": "reforma-construcao" },
    { "id": 85, "nome": "Reforma de pisos", "value": "reforma-pisos", "categoria": "reforma-construcao" },
    { "id": 86, "nome": "Consultor de marketing", "value": "consultor-marketing", "categoria": "solucoes-profissionais" },
    { "id": 87, "nome": "Professor profisional", "value": "professor", "categoria": "solucoes-profissionais" },
    { "id": 88, "nome": "Designer Gráfico", "value": "design-grafico", "categoria": "solucoes-profissionais" },
    { "id": 89, "nome": "Redator/Tradutor", "value": "tradutor", "categoria": "solucoes-profissionais" },
    { "id": 90, "nome": "Editor de vídeo", "value": "editor-video", "categoria": "solucoes-profissionais" },
    { "id": 91, "nome": "Téc. de informática e celular", "value": "tec-informatica", "categoria": "solucoes-profissionais" },
    { "id": 92, "nome": "Social media", "value": "social-media", "categoria": "solucoes-profissionais" },
    { "id": 93, "nome": "Web designer", "value": "web-designer", "categoria": "solucoes-profissionais" },
    { "id": 94, "nome": "Ilustrador digital", "value": "ilustrador-digital", "categoria": "solucoes-profissionais" },
    { "id": 95, "nome": "Aluguel de caminhão", "value": "caminhao", "categoria": "transporte" },
    { "id": 96, "nome": "Moto-boy", "value": "motoboy", "categoria": "transporte" },
    { "id": 97, "nome": "Aluguel de carro/van", "value": "carro", "categoria": "transporte" },
    { "id": 98, "nome": "Mudança comercial", "value": "mudanca-comercio", "categoria": "transporte" },
    { "id": 99, "nome": "Frete", "value": "frete", "categoria": "transporte" },
    { "id": 100, "nome": "Mudança residencial", "value": "mudanca-residencia", "categoria": "transporte" },
    { "id": 101, "nome": "Guincho", "value": "guincho", "categoria": "transporte" },
    { "id": 102, "nome": "Transporte de animais", "value": "animais", "categoria": "transporte" },
    {"id": 103,"nome": "Programador", "value": "programador" ,"categoria": "solucoes-profissionais"}
];

const serviceIdMap = allServices.reduce((acc, service) => {
    acc[service.value] = service.id;
    return acc;
}, {});

const formatCategoryToKey = (name) => {
    return name
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+e\s+/g, '-')
        .replace(/\s+/g, '-');
};

const categoryIdMap = allCategores.reduce((acc, category) => {
    const categoryValue = formatCategoryToKey(category.nome);
    acc[categoryValue] = category.id;
    return acc;
}, {});

const cleanNonNumeric = (value) => {
    return value ? value.replace(/[^0-9]/g, '') : '';
};

const formatDateToISO = (dateStr) => {
    if (!dateStr || dateStr.length !== 10) return dateStr;
    const [day, month, year] = dateStr.split('/');
    if (day && month && year) {
        return `${day}/${month}/${year}`;
    }
    return dateStr;
};

const getServicesByCategory = (category) => {
    return allServices.filter(service => service.categoria === category);
};

const caseSensitiveFields = ['password', 'password2' ,'genero' ,'nome_completo']; 

// --- FIM ARRAYS E FUNÇÕES AUXILIARES ---

export default function ProviderRegistration() {
    const [categoria, setCategoria] = useState(''); 
    const [formDataProvider, setFormDataProvider] = useState({}); 

    // ESTADO para erros da API
    const [formErrors, setFormErrors] = useState({}); 
    
    // Hook para detecção de mobile
    const isMobile = useIsMobile();
    
    // Função auxiliar para obter a mensagem de erro (o primeiro item do array)
    const getErrorMessage = (fieldName) => {
        if (formErrors[fieldName] && Array.isArray(formErrors[fieldName]) && formErrors[fieldName].length > 0) {
            return formErrors[fieldName][0];
        }
        return null;
    };

    const handleChangeSetDataProvider = useCallback((e) => {
        const { name, value } = e.target;

        // Limpa o erro para o campo atual ao iniciar a edição
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: null 
        }));

        const lowerCasedValue = caseSensitiveFields.includes(name)
            ? value
            : (typeof value === 'string' ? value.toLowerCase() : value);

        let finalValueToSave = lowerCasedValue;

        if (name === 'cpf' || name === 'cep' || name === 'telefone_publico') {
            finalValueToSave = cleanNonNumeric(lowerCasedValue);
        } else if (name === 'dt_nascimento') {
            finalValueToSave = formatDateToISO(lowerCasedValue);
        }

        if (name === 'categoria') {
            const selectedValue = lowerCasedValue; 
            const selectedId = categoryIdMap[selectedValue]; 

            setCategoria(selectedValue);
            
            setFormDataProvider(prevData => ({
                ...prevData,
                [name]: selectedId !== undefined ? selectedId : null, 
                'servico': null // Reseta o serviço ao mudar a categoria
            }));
            setFormErrors(prevErrors => ({
                ...prevErrors,
                'servico': null // Limpa o erro do serviço também
            }));
            return;

        } else if (name === 'servico') {
            const selectedId = serviceIdMap[lowerCasedValue];

            setFormDataProvider(prevData => ({
                ...prevData,
                [name]: selectedId !== undefined ? selectedId : null
            }));
            return;
        }

        setFormDataProvider(prevData => ({
            ...prevData,
            [name]: finalValueToSave
        }));
    }, []);

    const { register, loading } = ProviderServices();
    const { setAuthData } = useAuth();

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors({}); 

        register(formDataProvider)
            .then((result) => {
                setAuthData(result);
                navigate('/providerPerfil')
            })
            .catch((errorObject) => {
                console.error('Erros de validação da API:', errorObject);
                setFormErrors(errorObject); // Salva o objeto de erros no estado
            });
    };

    const selectedServiceValue = formDataProvider.servico
        ? allServices.find(s => s.id === formDataProvider.servico)?.value || ''
        : '';

    // LÓGICA DE CARREGAMENTO CONDICIONAL
    if (loading) {
        if (isMobile) {
            return <div className={styles.load}><Loading2 /></div> 
        }
        return <Loading />; 
    }
    
    return (
        <div className={styles.userRegistrationContainer}>
            <div className={styles.registrationForm}>
                <h5>Seu próximo cliente está a um click.</h5>
                <h2>CADASTRE-SE!</h2>
                <form onSubmit={handleSubmit}> 
                    
                    {/* Campo: nome_completo */}
                    {getErrorMessage('nome_completo') && (
                        <p className={styles.errorMessage}>{getErrorMessage('nome_completo')}</p>
                    )}
                    <input
                        value={formDataProvider.nome_completo || ''} 
                        type="text"
                        placeholder="Nome Completo"
                        name='nome_completo'
                        onChange={handleChangeSetDataProvider}
                        required
                    />

                    {/* CPF e Data de Nascimento */}
                    {getErrorMessage('cpf') && (
                        <p className={styles.errorMessage}>{getErrorMessage('cpf')}</p>
                    )}  
                    {getErrorMessage('dt_nascimento') && (
                        <p className={styles.errorMessage}>{getErrorMessage('dt_nascimento')}</p>
                    )}
                    <div className={styles.input50}>
                        
                        {/* Campo: cpf */}
                        <IMaskInput
                            mask="000.000.000-00"
                            name='cpf'
                            placeholder='Cpf'
                            type="text"
                            value={formDataProvider.cpf || ''} 
                            onChange={handleChangeSetDataProvider}
                            required
                        />
                        
                        {/* Campo: dt_nascimento */}
                        <IMaskInput
                            mask="00/00/0000"
                            name='dt_nascimento'
                            value={formDataProvider.dt_nascimento || ''}
                            placeholder='Data de nascimento'
                            onChange={handleChangeSetDataProvider}
                            type="text"
                            required
                        />
                    </div>

                    {/* Campo: genero */}
                    {getErrorMessage('genero') && (
                        <p className={styles.errorMessage}>{getErrorMessage('genero')}</p>
                    )}
                    <select
                        id="genero"
                        name='genero'
                        value={formDataProvider.genero || ''}
                        onChange={handleChangeSetDataProvider}
                        required
                    >
                        <option value="" disabled hidden>Gênero</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="t">Transgênero</option>
                        <option value="nao-binario">Não-binário</option>
                        <option value="nao-informado">Prefiro não informar</option>
                    </select>

                    {/* Rua e Número */}
                    <div className={styles.input50}>
                        {/* Campo: rua */}
                        {getErrorMessage('rua') && (
                            <p className={styles.errorMessage}>{getErrorMessage('rua')}</p>
                        )}
                        <input
                            type="text"
                            placeholder='Rua'
                            name='rua'
                            value={formDataProvider.rua || ''}
                            onChange={handleChangeSetDataProvider}
                            required
                        />
                        
                        {/* Campo: numero_casa */}
                        {getErrorMessage('numero_casa') && (
                            <p className={styles.errorMessage}>{getErrorMessage('numero_casa')}</p>
                        )}
                        <input
                            type="number"
                            placeholder='Numero'
                            name='numero_casa'
                            value={formDataProvider.numero_casa || ''}
                            onChange={handleChangeSetDataProvider}
                            required
                        />
                    </div>

                    {/* Campo: cep */}
                    {getErrorMessage('cep') && (
                        <p className={styles.errorMessage}>{getErrorMessage('cep')}</p>
                    )}
                    <IMaskInput
                        mask="00000-000"
                        name='cep'
                        value={formDataProvider.cep || ''}
                        onChange={handleChangeSetDataProvider}
                        placeholder='Cep'
                        type="text"
                        required
                    />

                    {/* Campo: telefone_publico */}
                    {getErrorMessage('telefone_publico') && (
                        <p className={styles.errorMessage}>{getErrorMessage('telefone_publico')}</p>
                    )}
                    <IMaskInput
                        mask={['(00) 0000-0000', '(00) 00000-0000']}
                        name='telefone_publico'
                        value={formDataProvider.telefone_publico || ''}
                        onChange={handleChangeSetDataProvider}
                        placeholder='Telefone'
                        type="tel"
                        required
                    />

                    {/* Categoria e Serviço */}
                    <div className={styles.input50}>
                        {/* Campo: categoria (AGORA ORDENADO) */}
                        {getErrorMessage('categoria') && (
                            <p className={styles.errorMessage}>{getErrorMessage('categoria')}</p>
                        )}
                        <select
                            id="categoria"
                            name='categoria'
                            value={categoria} 
                            onChange={handleChangeSetDataProvider}
                            required
                        >
                            <option value="" disabled hidden>Categoria do serviço</option>
                            {/* Ordenação Alfabética das Categorias */}
                            {allCategores
                                .slice()
                                .sort((a, b) => a.nome.localeCompare(b.nome))
                                .map(cat => {
                                    const categoryValue = formatCategoryToKey(cat.nome);
                                    return (
                                        <option
                                            key={cat.id}
                                            value={categoryValue} 
                                        >
                                            {cat.nome}
                                        </option>
                                    );
                                })}
                        </select>

                        {/* Campo: servico (AGORA ORDENADO) */}
                        {getErrorMessage('servico') && (
                            <p className={styles.errorMessage}>{getErrorMessage('servico')}</p>
                        )}
                        <select
                            id="servico"
                            name='servico'
                            value={selectedServiceValue} 
                            onChange={handleChangeSetDataProvider}
                            required
                            disabled={categoria === ''}
                        >
                            <option value="" disabled hidden>Serviço</option>
                            {categoria === '' && (
                                <option value="" disabled>Selecione uma categoria</option>
                            )}

                            {/* Ordenação Alfabética dos Serviços */}
                            {getServicesByCategory(categoria)
                                .sort((a, b) => a.nome.localeCompare(b.nome))
                                .map(service => (
                                    <option
                                        key={service.id}
                                        value={service.value} 
                                    >
                                        {service.nome}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Disponibilidade e Final de Semana */}
                    <div className={styles.input50}>
                        {/* Campo: disponibilidade */}
                        {getErrorMessage('disponibilidade') && (
                            <p className={styles.errorMessage}>{getErrorMessage('disponibilidade')}</p>
                        )}
                        <select
                            id="disponibilidade"
                            name='disponibilidade'
                            value={formDataProvider.disponibilidade|| ''}
                            onChange={handleChangeSetDataProvider}
                            required
                        >
                            <option value="" disabled hidden>Disponibilidade 24H</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                        </select>

                        {/* Campo: atende_fim_de_semana */}
                        {getErrorMessage('atende_fim_de_semana') && (
                            <p className={styles.errorMessage}>{getErrorMessage('atende_fim_de_semana')}</p>
                        )}
                        <select
                            id="atende_fim_de_semana"
                            name='atende_fim_de_semana'
                            value={formDataProvider.atende_fim_de_semana || ''}
                            onChange={handleChangeSetDataProvider}
                            required
                        >
                            <option value="" disabled hidden>Final de semana</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                        </select>
                    </div>

                    {/* Campo: email */}
                    {getErrorMessage('email') && (
                        <p className={styles.errorMessage}>{getErrorMessage('email')}</p>
                    )}
                    <input type="email" value={formDataProvider.email || ''} placeholder="Email" name='email' onChange={handleChangeSetDataProvider} required />

                    {/* Campo: password */}
                    {getErrorMessage('password') && (
                        <p className={styles.errorMessage}>{getErrorMessage('password')}</p>
                    )}
                    <input type="password" value={formDataProvider.password || ''} placeholder="Senha" onChange={handleChangeSetDataProvider} name='password' required />
                    
                    {/* Campo: password2 */}
                    {getErrorMessage('password2') && (
                        <p className={styles.errorMessage}>{getErrorMessage('password2')}</p>
                    )}
                    <input type="password" value={formDataProvider.password2 || ''} placeholder="Confirme a Senha" onChange={handleChangeSetDataProvider} name='password2' required />

                    <button type="submit">Cadastrar</button>
                </form>
            </div>

            <div className={styles.registrationImage}>
                <img src="/img/registration/registrationProvider.jpeg" alt="Imagem de cadastro de usuário" />
            </div>
        </div>
    );
}