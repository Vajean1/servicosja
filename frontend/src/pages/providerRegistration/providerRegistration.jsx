import { useState, useEffect, useCallback, useMemo } from 'react';
import { IMaskInput } from 'react-imask';
import styles from './Registration.module.css';
import ProviderServices from '../../services/provider';
import CategoryServices from '../../services/categories';
import Loading from '../loading/loading';
import Loading2 from '../loading/loading2';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hook/useIsMobile';

// --- ARRAYS E FUNÇÕES AUXILIARES ---

const formatCategoryToKey = (name) => {
    return name
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+e\s+/g, '-')
        .replace(/\s+/g, '-');
};

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

const caseSensitiveFields = ['password', 'password2' ,'genero' ,'nome_completo'];

// --- FIM ARRAYS E FUNÇÕES AUXILIARES ---

export default function ProviderRegistration() {
    const [categoria, setCategoria] = useState('');
    const [formDataProvider, setFormDataProvider] = useState({});

    // ESTADO para erros da API
    const [formErrors, setFormErrors] = useState({});

    // Hook para detecção de mobile
    const isMobile = useIsMobile();

    // Services
    const { register, loading } = ProviderServices();
    const { categories, getCategories, loadingCategories } = CategoryServices();
    const { setAuthData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const processedCategories = useMemo(() => {
        return (categories || []).map(cat => ({
            ...cat,
            key: formatCategoryToKey(cat.nome)
        }));
    }, [categories]);

    const processedServices = useMemo(() => {
        return processedCategories.flatMap(cat =>
            (cat.servicos || []).map(serv => ({
                ...serv,
                value: serv.value || formatCategoryToKey(serv.nome),
                categoria: cat.key
            }))
        );
    }, [processedCategories]);

    const categoryIdMap = useMemo(() => {
        return processedCategories.reduce((acc, category) => {
            acc[category.key] = category.id;
            return acc;
        }, {});
    }, [processedCategories]);

    const serviceIdMap = useMemo(() => {
        return processedServices.reduce((acc, service) => {
            acc[service.value] = service.id;
            return acc;
        }, {});
    }, [processedServices]);

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
                'servico': null
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
    }, [categoryIdMap, serviceIdMap]);

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
        ? processedServices.find(s => s.id === formDataProvider.servico)?.value || ''
        : '';

    const filteredServices = useMemo(() => {
         return processedServices.filter(service => service.categoria === categoria);
    }, [processedServices, categoria]);


    // LÓGICA DE CARREGAMENTO CONDICIONAL
    if (loading || loadingCategories) {
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
                        <option value="T">Transgênero</option>
                        <option value="N">Não-binário</option>
                        <option value="P">Prefiro não informar</option>
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
                        mask={['(00) 00000-0000', '(00) 00000-0000']}
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
                            {processedCategories
                                .slice()
                                .sort((a, b) => a.nome.localeCompare(b.nome))
                                .map(cat => {
                                    return (
                                        <option
                                            key={cat.id}
                                            value={cat.key}
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
                            {filteredServices
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
