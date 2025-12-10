import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import styles from './userPerfil.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaEdit } from "react-icons/fa";
import UserServices from '../../services/user';
import ProviderServices from '../../services/provider';
import EditUserModal from '../../components/editUserModal/EditUserModal';
import { useProviderContext } from '../../context/providerSelected';
import ProviderBox from '../../components/providerBox/providerBox';

const ReviewModal = ({ open, close, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (rating === 0) {
            alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }
        onSubmit(rating, comment);
        setRating(0);
        setComment("");
        close();
    };

    return (
        <Dialog open={open} onClose={close}>
            <div className={styles.modalContent}>
                <h2>Avaliar Serviço</h2>
                <div className={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                            key={star}
                            className={`${styles.star} ${star <= rating ? styles.starActive : ''}`}
                            onClick={() => setRating(star)}
                            style={{ cursor: 'pointer' }}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea 
                    placeholder="Escreva um comentário (opcional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button className={styles.submitButton} onClick={handleSubmit}>Enviar Avaliação</button>
            </div>
        </Dialog>
    );
};

const getImageUrl = (url) => {
    if (!url) return '';

    // Corrigir URLs locais legadas para apontar para produção
    if (url.startsWith('http://127.0.0.1:8000')) {
        return url.replace('http://127.0.0.1:8000', 'https://back-end-servicosja-api.onrender.com');
    }
    if (url.startsWith('http://localhost:8000')) {
         return url.replace('http://localhost:8000', 'https://back-end-servicosja-api.onrender.com');
    }

    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `https://back-end-servicosja-api.onrender.com${url}`;
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Data Inválida" : date.toLocaleDateString('pt-BR');
};

const mockUserData = {
    nome: "Eduardo Jesen",
    cargo: "Designer Gráfico",
    dataNasc: "17/09/1997",
    genero: "Masculino",
    telefone: "(81) 99966-6600",
    dataRegistro: "28/11/2025",
    email: "eduardojesen@example.com",
    linkedIn: "user2025",
    perfilImg: "/img/logo/logoIcon.png",
    mensagens: [
        { nome: "João Victor", data: "28/11" },
        { nome: "Maria Silva", data: "27/11" },
        { nome: "Pedro Lima", data: "26/11" },
    ],
    galeria: [
        { id: 1, url: "../assets/img/imagemServico1.png" },
        { id: 2, url: "../assets/img/imagemServico2.png" },
        { id: 3, url: "../assets/img/imagemServico3.png" },
        { id: 4, url: "../assets/img/imagemServico4.png" },
    ],
    avaliacoes: [
        { estrelas: 5, percentual: 82 },
        { estrelas: 4, percentual: 10 },
        { estrelas: 3, percentual: 4 },
        { estrelas: 2, percentual: 2 },
        { estrelas: 1, percentual: 2 },
    ]
};

const TABS = {
    DASHBOARD: 'Dashboard',
    MESSAGES: 'Mensagens'
};

// --- FUNÇÃO ADICIONADA: Filtra apenas as duas primeiras palavras do nome ---
const getFirstTwoNames = (fullName) => {
    if (!fullName) return '';
    // Divide o nome em palavras, pega as duas primeiras e as une novamente com espaço.
    return fullName.split(' ').slice(0, 2).join(' ');
};
// -------------------------------------------------------------------------


export default function UserPerfil({ userData = mockUserData }) {
    const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [selectedSolicitacaoId, setSelectedSolicitacaoId] = useState(null);

    const [profileData, setProfileData] = useState(null);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [canceledServices, setCanceledServices] = useState([]);
    const [ongoingServices, setOngoingServices] = useState([]);
    const [completedServices, setCompletedServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const { setProviderSelected } = useProviderContext();
    const { getMe, getClientSolicitations, createReview, getUserReviews, getFavorites } = UserServices();
    const { getProviderByUserId } = ProviderServices();

    useEffect(() => {
        getMe()
            .then(data => {
                setProfileData(data);
            })
            .catch(err => {
                console.error("Erro ao buscar dados do perfil:", err);
            });

        getUserReviews()
            .then(data => {
                let reviewsList = [];
                if (Array.isArray(data)) {
                    reviewsList = data;
                } else if (data?.results && Array.isArray(data.results)) {
                    reviewsList = data.results;
                } else if (data?.avaliacoes && Array.isArray(data.avaliacoes)) {
                    reviewsList = data.avaliacoes;
                }
                setReviews(reviewsList);
            })
            .catch(err => console.error("Erro ao buscar avaliações:", err));
            
        getClientSolicitations()
            .then(data => {
                // Filter: completed service but NOT evaluated
                if (Array.isArray(data)) {
                    const pending = data.filter(s => s.servico_realizado && !s.avaliacao_realizada);
                    setPendingReviews(pending);

                    // Filter: Canceled / Not Realized
                    const canceled = data.filter(s => s.data_conclusao && !s.servico_realizado);
                    setCanceledServices(canceled);

                    // Filter: Ongoing (Em andamento) - No Conclusion Date
                    const ongoing = data.filter(s => !s.data_conclusao);
                    setOngoingServices(ongoing);

                    // Filter: Completed History (Already Evaluated)
                    const completed = data.filter(s => s.servico_realizado && s.avaliacao_realizada);
                    setCompletedServices(completed);
                }
            })
            .catch(err => console.error("Erro ao buscar solicitações:", err));

        // Busca favoritos apenas se for cliente
        if (user?.tipo_usuario === 'cliente') {
            getFavorites()
                .then(data => {
                    let favsList = [];
                    if (Array.isArray(data)) {
                        favsList = data;
                    } else if (data?.results && Array.isArray(data.results)) {
                        favsList = data.results;
                    }
                    setFavorites(favsList);
                })
                .catch(err => console.error("Erro ao buscar favoritos:", err));
        }
    }, [user]);

    const handleOpenReviewModal = (solicitacaoId) => {
        setSelectedSolicitacaoId(solicitacaoId);
        setOpenReviewModal(true);
    };

    const handleSubmitReview = async (rating, comment) => {
        try {
            await createReview({
                solicitacao_contato_id: selectedSolicitacaoId,
                nota: rating,
                comentario: comment
            });
            alert("Avaliação enviada com sucesso!");
            setPendingReviews(prev => prev.filter(p => p.id !== selectedSolicitacaoId));
            // Opcional: Atualizar completedServices se quisermos mover imediatamente
        } catch (error) {
            console.error("Erro ao avaliar:", error);
            alert("Erro ao enviar avaliação.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdateProfile = () => {
        getMe().then(data => setProfileData(data));
    };

    const handleNavigateToProvider = async (review) => {
        // Tenta extrair o ID de várias formas possíveis
        const initialId = review.prestador_id || review.prestador?.id || (typeof review.prestador === 'number' ? review.prestador : null);
        
        if (initialId) {
            // Tenta encontrar o perfil correto usando o ID (assumindo que pode ser um user_id)
            const providerProfile = await getProviderByUserId(initialId);
            
            if (providerProfile && providerProfile.id) {
                // Se encontrou o perfil, usa o ID do perfil
                setProviderSelected(providerProfile);
                navigate('/providerDatails');
            } else {
                // Fallback: Se não encontrou (ou falhou), tenta usar o ID original
                // Pode ser que o ID original já fosse o ID do perfil
                console.warn("Perfil não encontrado via user_id, tentando ID original:", initialId);
                setProviderSelected({ id: initialId });
                navigate('/providerDatails');
            }
        } else {
            console.warn("Não foi possível identificar o ID do prestador na avaliação:", review);
        }
    };

    const displayData = profileData ? {
        nome: profileData.nome_completo || "Nome não informado",
        cargo: profileData.tipo_usuario === 'cliente' ? "Cliente" : "Prestador",
        dataNasc: profileData.perfil_cliente?.dt_nascimento || profileData.dt_nascimento || "N/A",
        genero: profileData.perfil_cliente?.genero || profileData.genero || "N/A",
        telefone: profileData.perfil_cliente?.telefone_contato || profileData.telefone_contato || "N/A",
        dataRegistro: profileData.perfil_cliente?.data_registro || (profileData.data_joined ? new Date(profileData.data_joined).toLocaleDateString('pt-BR') : "N/A"),
        email: profileData.email || "Email não informado",
        linkedIn: "N/A",
        perfilImg: getImageUrl(profileData.foto || profileData.foto_perfil || profileData.perfil_cliente?.foto || profileData.perfil_cliente?.foto_perfil) || userData.perfilImg,
        mensagens: userData.mensagens,
        galeria: userData.galeria, 
        avaliacoes: userData.avaliacoes 
    } : userData;


    const getTabClassName = (tab) => {
        return `${styles.tab} ${activeTab === tab ? styles.active : ''}`;
    };

    return (
        <div className={styles.dashboardPage}>
            {/* --- Cabeçalho (Header) --- */}
            <header className={styles.header}>
                <div className={styles.perfil}>
                    
                    <div className={styles.perfilImgWrapper}>
                            <img src={displayData.perfilImg} alt="perfil" />
                        <FaEdit 
                                className={styles.editIconProfile}
                                onClick={() => setOpenEditModal(true)} 
                                title="Editar Perfil"
                            />
                    </div>
                    <div >
                        <h2 className={styles.nameContainer}>
                            {getFirstTwoNames(displayData?.nome)?.toUpperCase()} 
                            
                        </h2>
                        <p>{displayData.cargo}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FaSignOutAlt /> Sair
                </button>
            </header>

           

            {/* --- Conteúdo Principal (Container) --- */}
            <div className={styles.container}>

                {/* --- Serviços Pendentes de Avaliação --- */}
                {pendingReviews.length > 0 && (
                    <div className={styles.box} style={{ marginBottom: '20px' }}>
                        <h2>Avaliar Serviços Concluídos</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Prestador</th>
                                    <th>Data</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingReviews.map((sol) => (
                                    <tr key={sol.id}>
                                        <td>{sol.prestador_nome || sol.prestador_id}</td>
                                        <td>{formatDate(sol.data_conclusao || sol.data_solicitacao)}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleOpenReviewModal(sol.id)}
                                                className={styles.actionButton}
                                            >
                                                Avaliar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* --- Informações Pessoais (Descrição) --- */}
                <div className={styles.box}>
                    <h2>Informações Pessoais</h2>
                    <div className={styles.iconEdit} onClick={() => setOpenEditModal(true)}>
                                    <FaEdit />
                                </div>
                    <div className={styles.descricaoGrid}>
                        <span>Nome: {displayData.nome}</span>
                        <span>Data de Nasc: {displayData.dataNasc}</span>
                        <span>Gênero: {displayData.genero}</span>
                        <span>Telefone: {displayData.telefone}</span>
                        <span>Cargo: {displayData.cargo}</span>
                        <span>Data de Registro: {displayData.dataRegistro}</span>
                        <span>Email: {displayData.email}</span>
                        <span>LinkedIn: {displayData.linkedIn}</span>
                    </div>
                </div>

                {/* --- Favoritos --- */}
                {user?.tipo_usuario === 'cliente' && (
                    <div className={styles.box}>
                        <h2>Meus Prestadores Favoritos</h2>
                        {favorites.length > 0 ? (
                            <div className={styles.favoritesGrid}>
                                {favorites.map((fav) => (
                                    <div 
                                        key={fav.id} 
                                        onClick={() => { setProviderSelected(fav); navigate('/providerDatails'); }} 
                                        className={styles.favoriteItem}
                                    >
                                        <ProviderBox 
                                            name={fav.nome} 
                                            location={`${fav.cidade || ''}, ${fav.bairro || ''}`} 
                                            rating={fav.nota_media} 
                                            resum={fav.biografia || "Sem descrição."} 
                                            image={getImageUrl(fav.foto || fav.foto_perfil)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.emptyStateText}>Você ainda não favoritou nenhum prestador.</p>
                        )}
                    </div>
                )}

                {/* --- Avaliações enviadas --- */}
                <div className={styles.flex}>

                    {/* Minhas Avaliações */}
                    <div className={`${styles.box} ${styles.mensagens}`}>
                        <h2>Minhas Avaliações Enviadas</h2>
                        {reviews.length === 0 ? (
                            <p className={styles.emptyStateText}>Você ainda não enviou nenhuma avaliação.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Prestador</th>
                                        <th>Nota</th>
                                        <th>Comentário</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((rev, index) => (
                                        <tr 
                                            key={rev.id || index} 
                                            onClick={() => handleNavigateToProvider(rev)}
                                            className={styles.clickableRow}
                                            title="Ver perfil do prestador"
                                        >
                                            <td>{rev.prestador_nome || rev.prestador?.nome || rev.prestador || "Nome indisponível"}</td>
                                            <td className={styles.reviewStar}>{rev.nota} ★</td>
                                            <td>{rev.comentario}</td>
                                            <td>{formatDate(rev.data_criacao || rev.created_at || rev.data)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        
                    </div>

                  
                </div>
                    
                {/* --- Serviços Em Andamento --- */}
                {ongoingServices.length > 0 && (
                    <div className={styles.box} style={{ marginBottom: '20px' }}>
                        <h2 className={styles.titlePrimary}>Solicitações em Andamento</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Prestador</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ongoingServices.map((sol) => (
                                    <tr key={sol.id}>
                                        <td>{sol.prestador_nome || sol.prestador_id}</td>
                                        <td className={styles.textPrimaryBold}>
                                            Aguardando Conclusão
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Histórico de Serviços Concluídos --- */}
                {completedServices.length > 0 && (
                    <div className={styles.box} style={{ marginBottom: '20px' }}>
                        <h2 className={styles.titleSuccess}>Histórico de Serviços Concluídos</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Prestador</th>
                                    <th>Data Conclusão</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedServices.map((sol) => (
                                    <tr key={sol.id}>
                                        <td>{sol.prestador_nome || sol.prestador_id}</td>
                                        <td>{formatDate(sol.data_conclusao)}</td>
                                        <td className={styles.textSuccessBold}>
                                            Concluído e Avaliado
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- Serviços Cancelados / Não Realizados --- */}
                {canceledServices.length > 0 && (
                    <div className={styles.box} style={{ marginBottom: '20px' }}>
                        <h2 className={styles.titleDanger}>Solicitações Não Realizadas</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Prestador</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {canceledServices.map((sol) => (
                                    <tr key={sol.id}>
                                        <td>{sol.prestador_nome || sol.prestador_id}</td>
                                        <td>{formatDate(sol.data_conclusao || sol.data_solicitacao)}</td>
                                        <td className={styles.textDangerBold}>
                                            Cancelado pelo Prestador
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            
            </div>
            
            <EditUserModal 
                open={openEditModal} 
                close={() => setOpenEditModal(false)} 
                userData={profileData} 
                onUpdate={handleUpdateProfile} 
            />

            <ReviewModal 
                open={openReviewModal} 
                close={() => setOpenReviewModal(false)} 
                onSubmit={handleSubmitReview} 
            />
        </div>
    );
}
