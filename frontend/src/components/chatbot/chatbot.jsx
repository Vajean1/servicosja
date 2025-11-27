import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './chatbot.module.css';

const WEBHOOK_URL = "https://mathewsand.app.n8n.cloud/webhook/d985422e-3bc3-46d8-8377-9c346c23046d";

const RobotIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect x="12" y="20" width="40" height="28" rx="6" ry="6" fill="white"/>
      <circle cx="24" cy="34" r="4" fill="#ff6b35"/>
      <circle cx="40" cy="34" r="4" fill="#ff6b35"/>
      <rect x="26" y="48" width="12" height="4" rx="2" fill="white"/>
      <rect x="30" y="12" width="4" height="8" rx="2" fill="white"/>
      <circle cx="32" cy="8" r="3" fill="#ff6b35"/>
    </svg>
);

const AttachmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.44 11.05 12.7 19.8a5 5 0 0 1-7.07-7.07l8.25-8.26a3 3 0 0 1 4.24 4.25l-7.78 7.78a1 1 0 0 1-1.41-1.41l7.07-7.08"
        stroke="#001a4d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Message = ({ type, content, isImage = false }) => {
    const className = type === 'user' ? styles.msgUser : styles.msgBot;

    if (isImage) {
        return (
            <div className={className}>
                <img src={content} alt="Anexo do Usuário" className={styles.msgImg} />
            </div>
        );
    }
  
    const formattedContent = content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            {index < content.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));

    return <div className={className}>{formattedContent}</div>;
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = useCallback(async (text = null, file = null) => {
        const message = text || inputValue.trim();
        if (!message && !file) return;

        if (message) {
            setMessages(prev => [...prev, { type: 'user', content: message, isImage: false }]);
        }
        setInputValue('');

        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                setMessages(prev => [...prev, { type: 'user', content: e.target.result, isImage: true }]);
            };
            reader.readAsDataURL(file);
        }

        setIsTyping(true);

        try {
            const formData = new FormData();
            if (message) formData.append("chatInput", message);
            if (file) formData.append("file", file);

            const resposta = await fetch(WEBHOOK_URL, { 
                method: "POST",
                body: formData
            });
            
            const rawText = await resposta.text(); 
            let finalResponse = "Sem resposta do servidor.";

            try {
                const data = JSON.parse(rawText);
                finalResponse = data.output || "Sem 'output' no JSON.";
                
            } catch (parseError) { 
                const match = rawText.match(/"output"\s*:\s*"([^"]+)"/); 
                finalResponse = match ? match[1].replace(/\\n/g, '\n') : `⚠️ Erro de interpretação. Resposta bruta: ${rawText.substring(0, 50)}...`;
            }

            setMessages(prev => [...prev, { type: 'bot', content: finalResponse, isImage: false }]);
            
        } catch (error) {
            console.error("Erro de conexão/timeout:", error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: "⚠️ Erro de Rede (Timeout). Verifique o console (F12).", 
                isImage: false 
            }]);
            
        } finally {
            setIsTyping(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
        }
    }, [inputValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            sendMessage(null, file); 
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={styles.chatbot}>
            <button 
                id="abrirChat" 
                className={styles.abrirChat} 
                title="Atendimento automático"
                onClick={() => setIsOpen(!isOpen)}
            >
                <RobotIcon />
            </button>

            <div 
                id="popupChat" 
                className={`${styles.popupChat} ${isOpen ? styles.aberto : ''}`}
            >
                <div className={styles.cabecalhoChat}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <img src="/img/logo/Simbolo.svg" alt="Logo Serviços Já"/>
                        <h4 style={{margin:0}}>Suporte Serviços Já</h4>
                    </div>
                    <button 
                        className={styles.fecharChat}
                        onClick={() => setIsOpen(false)}
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.mensagensChat} ref={messagesEndRef}>
                    {messages.map((msg, index) => (
                        <Message 
                            key={index} 
                            type={msg.type} 
                            content={msg.content} 
                            isImage={msg.isImage}
                        />
                    ))}
                    {isTyping && <Message type="bot" content="Digitando..." />}
                </div>

                <div className={styles.entradaChat}>
                    <button 
                        className={styles.anexoBtn}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        <AttachmentIcon />
                    </button>
                    <input 
                        type="file" 
                        id="inputArquivo" 
                        accept="image/*" 
                        style={{display:'none'}}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <input 
                        type="text" 
                        id="textoChat"
                        className={styles.textoChat}
                        placeholder="Digite sua mensagem..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className={styles.enviarChat}
                        onClick={() => sendMessage()}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;