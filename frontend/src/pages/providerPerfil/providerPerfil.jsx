import React, { useState, useEffect } from 'react';
import styles from './providerPerfil.module.css';

// --- Dados Mock (Inalterados) ---
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

// --- Componente Gallery (Inalterado) ---
const Gallery = ({ images, onImageSelect, onImageUpload, selectedImage }) => {
    return (
        <div className={styles.galleryContainer}>
            {/* Imagem em Destaque */}
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

            {/* Miniaturas da Galeria e Botão de Adicionar */}
            <div className={styles.thumbnailsContainer}>

                {/* Botão de Adicionar Foto (Input escondido) */}
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

                {/* Renderiza as miniaturas das imagens do usuário */}
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

// --- Componente Principal ProviderPerfil (Corrigido para Início Vazio) ---
export default function ProviderPerfil({ userData = mockUserData }) {
    const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
    
    const getTabClassName = (tab) => {
        return `${styles.tab} ${activeTab === tab ? styles.active : ''}`;
    };

    // INÍCIO VAZIO: O estado inicial é [] e null.
    const [userGalleryImages, setUserGalleryImages] = useState([]);
    const [currentMainImage, setCurrentMainImage] = useState(null);

    // --- Lógica de Limpeza de URL Object ---
    // ATENÇÃO: Se o userGalleryImages for muito grande, incluir ele na dependência
    // pode ser caro. Removendo a dependência, a limpeza usa o estado final no momento
    // da desmontagem do componente, o que é o comportamento mais comum para limpeza.
    useEffect(() => {
        return () => {
            userGalleryImages.forEach(item => {
                if (item.url && item.url.startsWith('blob:')) {
                    URL.revokeObjectURL(item.url);
                }
            });
        };
    }, []); // Array de dependências vazio para rodar a limpeza apenas na desmontagem.

    // --- Lógica de Upload ---
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
    
    // --- Lógica de Seleção ---
    const handleImageSelect = (url) => {
        setCurrentMainImage(url);
    };
    
    // --- Renderização (Inalterada) ---
    return (
        <div className={styles.dashboardPage}>
            {/* ... Header e Tabs ... */}
            <header className={styles.header}>
                <div className={styles.perfil}>
                    <img src={userData.perfilImg} alt="perfil" />
                    <div>
                        <h2>{userData.nome}</h2>
                        <p>{userData.cargo}</p>
                    </div>
                </div>
            </header>

            <div className={styles.tabs}>
                <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setActiveTab(TABS.DASHBOARD); }}
                    className={getTabClassName(TABS.DASHBOARD)} 
                >
                    {TABS.DASHBOARD}
                </a>
                <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setActiveTab(TABS.MESSAGES); }}
                    className={getTabClassName(TABS.MESSAGES)}
                >
                    {TABS.MESSAGES}
                </a>
            </div>

            <div className={styles.container}>

                {/* Informações Pessoais */}
                <div className={styles.box}>
                    <h2>Informações Pessoais</h2>
                    <div className={styles.descricaoGrid}>
                        <span>Nome: {userData.nome}</span>
                        <span>Data de Nasc: {userData.dataNasc}</span>
                        <span>Gênero: {userData.genero}</span>
                        <span>Telefone: {userData.telefone}</span>
                        <span>Cargo: {userData.cargo}</span>
                        <span>Data de Registro: {userData.dataRegistro}</span>
                        <span>Email: {userData.email}</span>
                        <span>LinkedIn: {userData.linkedIn}</span>
                    </div>
                </div>

                {/* Mensagens e Calendário */}
                <div className={styles.flex}>
                    <div className={`${styles.box} ${styles.mensagens}`}> 
                        <h2>Mensagens</h2>
                        <table>
                            <thead>
                                <tr><th>Nome</th><th>Data</th></tr>
                            </thead>
                            <tbody>
                                {userData.mensagens.map((msg, index) => (
                                    <tr key={index}>
                                        <td>{msg.nome}</td>
                                        <td>{msg.data}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={`${styles.box} ${styles.calendario}`}>
                        <h2>Calendário</h2>
                        <div className={styles.calendarBox}>
                            Novembro 2025
                            <div className={styles.calendarGrid}>
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                                    <div key={day}>{day}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                
                {/* --- COMPONENTE GALLERY --- */}
                <div className={styles.w_50}>
                   <Gallery
                        images={userGalleryImages }
                        onImageSelect={handleImageSelect}
                        onImageUpload={handleImageUpload}
                        selectedImage={currentMainImage}
                    /> 
                </div>

                {/* Avaliações */}
                <div className={`${styles.box} ${styles.avaliacoesBox}`}>
                    <h2>Avaliações</h2>
                    <div className={styles.graficoLinhas}>
                        <svg width="100%" height="150" viewBox="0 0 320 125">
                            <polyline 
                                points="10,120 60,80 110,90 160,40 210,70 260,30 310,50" 
                                fill="none" 
                                stroke="#1a06c9" 
                                strokeWidth="3" 
                            />
                        </svg>
                    </div>
                    <div className={styles.ratingsList}>
                        {userData.avaliacoes.map((rating) => (
                            <div key={rating.estrelas} className={styles.ratingRow}>
                                <span>{rating.estrelas} ★</span>
                                <div 
                                    className={`${styles.bar} ${styles[`bar${rating.estrelas}`]}`} 
                                    style={{ width: `${rating.percentual}%` }}
                                ></div>
                                <span>{rating.percentual}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}