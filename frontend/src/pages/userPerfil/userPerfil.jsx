import React, { useState } from 'react';
import styles from './userPerfil.module.css'; 

const mockUserData = {
    nome: "Eduardo Jesen",
    cargo: "Designer Gráfico",
    dataNasc: "17/09/1997",
    genero: "Masculino",
    telefone: "(81) 99966-6600",
    dataRegistro: "28/11/2025",
    email: "eduardojesen@example.com",
    linkedIn: "user2025",
    perfilImg: "../assets/img/perfil.jpg", 
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

export default function UserPerfil({ userData = mockUserData }) {
    const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
    
    // O objeto 'styles' agora contém todas as suas classes CSS
    
    // Função auxiliar para combinar classes (útil para tabs)
    const getTabClassName = (tab) => {
        // Combina a classe base (styles.tab) com a classe 'active' se for a aba ativa
        return `${styles.tab} ${activeTab === tab ? styles.active : ''}`;
    };

    return (
        <div className={styles.dashboardPage}>
            {/* --- Cabeçalho (Header) --- */}
            <header className={styles.header}>
                <div className={styles.perfil}>
                    <img src={userData.perfilImg} alt="perfil" />
                    <div>
                        <h2>{userData.nome}</h2>
                        <p>{userData.cargo}</p>
                    </div>
                </div>
            </header>

            {/* --- Abas de Navegação (Tabs) --- */}
            <div className={styles.tabs}>
                <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setActiveTab(TABS.DASHBOARD); }}
                    // Uso de template literal para classes condicionais
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

            {/* --- Conteúdo Principal (Container) --- */}
            <div className={styles.container}>

                {/* --- Informações Pessoais (Descrição) --- */}
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

                {/* --- Mensagens e Calendário --- */}
                <div className={styles.flex}>
                    
                    {/* Mensagens */}
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

                    {/* Calendário */}
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

                {/* --- Galeria de Fotos (Fotos) --- */}
                <div className={styles.box}>
                    <h2>Galeria de Fotos</h2>
                    <div className={styles.fotosGrid}>
                        {userData.galeria.map((src, index) => (
                            <img key={index} src={src} alt={`Serviço ${index + 1}`} />
                        ))}
                    </div>
                </div>

                {/* --- Avaliações (Avaliações) --- */}
                <div className={`${styles.box} ${styles.avaliacoesBox}`}>
                    <h2>Avaliações</h2>

                    {/* Gráfico de Linhas (SVG) */}
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

                    {/* Avaliações em 5 níveis */}
                    <div className={styles.ratingsList}>
                        {userData.avaliacoes.map((rating) => (
                            <div key={rating.estrelas} className={styles.ratingRow}>
                                <span>{rating.estrelas} ★</span>
                                {/* Combinação de classe estática (styles.bar) e dinâmica (styles.bar5) */}
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