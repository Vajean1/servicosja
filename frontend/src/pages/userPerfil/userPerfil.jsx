import React, { useState, useEffect, useMemo } from 'react';
import styles from './userPerfil.module.css';
import ProviderServices from '../../services/provider';
import { useNavigate } from 'react-router';
import RatingChart from './RatingChart'; 
import { FaEdit } from "react-icons/fa";
import UserServices from '../../services/user';

// --- MOCK DATA (Seus dados mockados) ---
const mockUserData = {
    nome: "Eduardo Jesen",
    cargo: "Designer Gráfico",
    dataNasc: "17/09/1997",
    genero: "Masculino",
    telefone: "(81) 99966-6600",
    dataRegistro: "28/11/2025",
    email: "eduardojesen@example.com",
    linkedIn: "user2025",
    perfilImg: "/img/exemples/Group 8.png",
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
        { estrelas: 5, percentual: 82, quantidade: 0 },
        { estrelas: 4, percentual: 10, quantidade: 0 },
        { estrelas: 3, percentual: 4, quantidade: 0 },
        { estrelas: 2, percentual: 2, quantidade: 0 },
        { estrelas: 1, percentual: 2, quantidade: 0 },
    ]
};

const TABS = {
    DASHBOARD: 'Dashboard',
    MESSAGES: 'Mensagens'
};

// --- Componente Gallery (Não alterado) ---
const Gallery = ({ images, onImageSelect, onImageUpload, selectedImage }) => {
    return (
        <div className={styles.galleryContainer}>
            <div className={styles.mainImageContainer}>
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt="Imagem em destaque do prestador"
                        className={styles.mainImage}
                    />
                ) : (
                    <div className={styles.emptyMainImage}>
                        Adicione e selecione uma imagem para ver em destaque.
                    </div>
                )}
            </div>

            <div className={styles.thumbnailsContainer}>
                <label htmlFor="file-upload" className={styles.addThumbnail}>
                    <span role="img" aria-label="Adicionar Foto">➕</span> Adicionar Foto
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    style={{ display: 'none' }}
                />

                {images.map((item, index) => (
                    <div
                        key={item.id}
                        className={`${styles.thumbnail} ${item.url === selectedImage ? styles.activeThumbnail : ''}`}
                        onClick={() => onImageSelect(item.url)}
                    >
                        <img src={item.url} alt={`Miniatura ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};


export default function ProviderPerfil({ userData = mockUserData }) {
    const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);

    const getTabClassName = (tab) => {
        return `${styles.tab} ${activeTab === tab ? styles.active : ''}`;
    };

    // --- Lógica de Limpeza de URL Object (Não alterado) ---
    useEffect(() => {
        return () => {
            userGalleryImages.forEach(item => {
                if (item.url && item.url.startsWith('blob:')) {
                    URL.revokeObjectURL(item.url);
                }
            });
        };
    }, []); 

    // --- Lógica de Upload e Seleção (Não alterado) ---
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            const newImageItem = {
                id: Date.now() + Math.random(),
                url: newImageUrl
            };
            
            setUserGalleryImages(prevImages => [...prevImages, newImageItem]);
            setCurrentMainImage(newImageUrl);
        }
        event.target.value = null;
    };
    
    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
    };
    
    const {getUserPerfil, providerAccount} = UserServices()
    const auth = localStorage.getItem('auth')
    const authData =  JSON.parse(auth) 
    const profileId = authData.user_id; 

    const navigate = useNavigate()

    useEffect(() => {
        if (!profileId) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 0);
            return () => clearTimeout(timer);
        } 
    }, [profileId, navigate]); 

    // 2. Chamada da API
    useEffect(()=>{
        if (profileId) {
            getUserPerfil(profileId);
        }
    },[profileId]) 
    
    
    useEffect(() => {
        if (providerAccount?.localizacao) {
            const locationQuery = providerAccount.localizacao;
            console.log(`Dados de localização carregados: ${locationQuery}. Nenhuma ação de mapa está sendo executada.`);
        }
    }, [providerAccount]);
    // --------------------------------------------------------------------
    
    const comentarios = providerAccount.ultimas_avaliacoes
    const estatisticas = providerAccount.estatisticas
    
    // --- Lógica de Transformação de Dados do Gráfico ---
    const transformedRatings = useMemo(() => {
        if (!estatisticas || !estatisticas.distribuicao) {
            return userData.avaliacoes; 
        }

        const distribuicao = estatisticas.distribuicao;
        const keys = Object.keys(distribuicao); 
        
        const newRatings = keys.map(key => {
            const starNumber = parseInt(key.split('_')[1], 10);
            const data = distribuicao[key];

            return {
                estrelas: starNumber,
                percentual: data.porcentagem,
                quantidade: data.quantidade,
            };
        });

        newRatings.sort((a, b) => b.estrelas - a.estrelas);
        return newRatings;
    }, [estatisticas, userData.avaliacoes]); 
    
    
    return (
        <div className={styles.dashboardPage}>
            <header className={styles.header}>
                <div className={styles.perfil}>
                    <div className={styles.imgEdit}><img src={userData.perfilImg} alt="perfil" /><FaEdit /></div>
                    <div>
                        <h2>{providerAccount?.nome?.toUpperCase()}</h2>
                        <p>Usuario</p>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                
                {/* 1. Informações Pessoais */}
                <div className={styles.box}>
                    <h2>Informações Pessoais</h2>
                    <div className={styles.iconEdit}><FaEdit /></div>
                    <div className={styles.descricaoGrid}>
                        <span>Nome: {providerAccount?.nome}</span>
                        <span>Data de Nasc: {providerAccount?.data_nascimento}</span>
                        <span>Gênero: {providerAccount?.genero}</span>
                        <span>Telefone: {providerAccount?.telefone_publico}</span>
                        <span>Data de Registro: {providerAccount?.data_registro}</span>
                        <span>Email: {providerAccount?.email}</span>
                        <span>Cidade: {providerAccount?.cidade}</span>
                        <span>Bairro: {providerAccount?.bairro}</span>
                    </div>
                </div>

               
               
            </div>
        </div>
    );
}