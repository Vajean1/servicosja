import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import styles from './userPerfil.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaEdit } from "react-icons/fa";
import UserServices from '../../services/user';
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
        "../assets/img/imagemServico1.png",
        "../assets/img/imagemServico2.png",
        "../assets/img/imagemServico3.png",
        "../assets/img/imagemServico4.png",
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
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const { setProviderSelected } = useProviderContext();
    const { getMe, getClientSolicitations, createReview, getUserReviews, getFavorites } = UserServices();

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
                    
                    <div style={{position:'relative'}}>
                            <img src={displayData.perfilImg} alt="perfil" />
                        <FaEdit 
                                style={{ cursor: 'pointer', fontSize: '18px' ,position:'absolute', bottom:0 ,right: '0px' }} 
                                onClick={() => setOpenEditModal(true)} 
                                title="Editar Perfil"
                            />
                    </div>
                    <div >
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* ALTERAÇÃO APLICADA AQUI: Limita o nome a duas palavras */}
                            {getFirstTwoNames(displayData?.nome)?.toUpperCase()} 
                            
                        </h2>
                        <p>{displayData.cargo}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem', marginLeft: 'auto', padding: '0 20px' , position: 'absolute' , top: '30px' , right:'5px'}}>
                    <FaSignOutAlt /> Sair
                </button>
            </header>

           

            {/* --- Conteúdo Principal (Container) --- */}
            <div className={styles.container}>
                
                {/* --- Serviços Pendentes de Avaliação --- */}
                {pendingReviews.length > 0 && (
                    <div className={styles.box} style={{ marginBottom: '20px' }}>
                        <h2>Avaliar Serviços Concluídos</h2>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '1px solid #ddd'}}>
                                    <th style={{padding: '10px', textAlign: 'left'}}>Prestador</th>
                                    <th style={{padding: '10px', textAlign: 'left'}}>Data</th>
                                    <th style={{padding: '10px', textAlign: 'left'}}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingReviews.map((sol) => (
                                    <tr key={sol.id} style={{borderBottom: '1px solid #eee'}}>
                                        <td style={{padding: '10px'}}>{sol.prestador_nome || sol.prestador_id}</td>
                                        <td style={{padding: '10px'}}>{formatDate(sol.data_conclusao || sol.data_solicitacao)}</td>
                                        <td style={{padding: '10px'}}>
                                            <button 
                                                onClick={() => handleOpenReviewModal(sol.id)}
                                                style={{
                                                    padding: '5px 10px',
                                                    backgroundColor: '#1a06c9',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer'
                                                }}
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {favorites.map((fav) => (
                                    <div 
                                        key={fav.id} 
                                        onClick={() => { setProviderSelected(fav); navigate('/providerDatails'); }} 
                                        style={{ cursor: 'pointer' }}
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
                            <p style={{textAlign: 'center', color: '#666'}}>Você ainda não favoritou nenhum prestador.</p>
                        )}
                    </div>
                )}

                {/* --- Mensagens e Calendário --- */}
                <div className={styles.flex}>

                    {/* Minhas Avaliações */}
                    <div className={`${styles.box} ${styles.mensagens}`}>
                        <h2>Minhas Avaliações Enviadas</h2>
                        {reviews.length === 0 ? (
                            <p style={{textAlign: 'center', color: '#666'}}>Você ainda não enviou nenhuma avaliação.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'left'}}>Prestador</th>
                                        <th style={{textAlign: 'left'}}>Nota</th>
                                        <th style={{textAlign: 'left'}}>Comentário</th>
                                        <th style={{textAlign: 'left'}}>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((rev, index) => (
                                        <tr key={rev.id || index}>
                                            <td>{rev.prestador_nome || rev.prestador?.nome || rev.prestador || "Nome indisponível"}</td>
                                            <td style={{color: '#ffc107'}}>{rev.nota} ★</td>
                                            <td>{rev.comentario}</td>
                                            <td>{formatDate(rev.data_criacao || rev.created_at || rev.data)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                  
                </div>

                
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
