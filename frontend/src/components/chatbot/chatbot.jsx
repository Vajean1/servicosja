import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './chatbot.module.css';

// URL DO WEBHOOK N8N 
const WEBHOOK_URL = "https://mathewsgomes.app.n8n.cloud/webhook/chatbot"; 
const ANIMATION_DURATION = 300; 

// ... (RobotIcon e Message component) ...

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

const Message = ({ type, content, onNumericOptionClick }) => {
    const className = type === 'user' ? styles.msgUser : styles.msgBot;

    let textParts = [];
    let buttonParts = [];

    if (type === 'bot' && content) {
        const lines = content.split('\n');

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return; 
            
            const commandMatch = trimmedLine.match(/^#CMD:([\d\.]+)\|/);

            if (commandMatch) {
                const commandKey = commandMatch[1]; 
                const buttonText = trimmedLine.substring(commandMatch[0].length).replace(/\.$/, '').trim();   
                
                buttonParts.push(
                    <button
                        key={`opt-${commandKey}`}
                        className={styles.opcaoBtn} 
                        onClick={() => onNumericOptionClick(commandKey, buttonText)}
                    >
                        {buttonText}
                    </button>
                );
            } else {
                const cleanText = trimmedLine.replace(/^[\*•-]\s*/, '').trim(); 
                if (cleanText) {
                    if (cleanText.includes('\n') || cleanText.includes(':')) {
                         textParts.push(<div key={`txt-${trimmedLine}`} style={{marginTop: '4px'}}>{cleanText}</div>);
                    } else {
                        textParts.push(<p key={`txt-${trimmedLine}`}>{cleanText}</p>);
                    }
                }
            }
        });

        if (buttonParts.length > 0 || textParts.length > 0) {
            return (
                <div className={className}>
                    {textParts} 
                    {buttonParts.length > 0 && (
                        <div className={styles.opcoesContainer}>
                            {buttonParts}
                        </div>
                    )}
                </div>
            );
        }
    }
    
    const formattedContent = content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line.replace(/^[\*•-]\s*/, '')}
            {index < content.split('\n').length - 1 && <br />}
        </React.Fragment>
    ));

    return <div className={className}>{formattedContent}</div>;
};

// =========================================================================
// COMPONENTE CHATBOT (PRINCIPAL)
// =========================================================================
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    
    //Controla a animação de saída
    const [isClosing, setIsClosing] = useState(false);
    
    const messagesEndRef = useRef(null);
    const popupRef = useRef(null);
    
    //Função para iniciar o processo de fechamento animado
    const handleClose = useCallback(() => {
        setIsClosing(true);
        // Espera a duração da animação antes de remover o componente do DOM
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false); // Reseta o estado de fechamento
        }, ANIMATION_DURATION);
    }, []);

    // FUNÇÕES DE CONTROLE DE UI (FECHAR POPUP, SCROLL)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && popupRef.current && !popupRef.current.contains(event.target)) {
                handleClose(); // Chama a função de fechamento animado
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Lógica para ABRIR o chat
    const handleToggle = () => {
        if (isOpen) {
            handleClose();
        } else {
            setIsClosing(false); // Garante que o estado de fechamento está limpo antes de abrir
            setIsOpen(true);
        }
    }

    // FUNÇÃO PRINCIPAL DE ENVIO 
    const sendMessage = useCallback(async (text = null) => {
        const message = text || inputValue.trim();
        if (!message) return; 

        if (message && !text) { 
            setMessages(prev => [...prev, { type: 'user', content: message }]); 
        }
        setInputValue('');

        setIsTyping(true);

        try {
            const formData = new FormData();
            formData.append("chatInput", message); 

            const resposta = await fetch(WEBHOOK_URL, { 
                method: "POST",
                body: formData
            });
            
            const rawText = await resposta.text();
            let finalResponse = rawText.trim();

            setMessages(prev => [...prev, { type: 'bot', content: finalResponse }]); 
            
        } catch (error) {
            console.error("Erro de conexão/timeout:", error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: "⚠️ Erro de Rede (Timeout). Verifique o console (F12).", 
            }]);
            
        } finally {
            setIsTyping(false);
        }
    }, [inputValue]);

    // FUNÇÃO QUE É CHAMADA AO CLICAR NO BOTÃO
    const handleNumericOptionClick = (optionKey, optionText) => {
        setMessages(prev => [...prev, { type: 'user', content: optionText }]); 
        sendMessage(optionKey);
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
                className={`${styles.abrirChat} ${isOpen ? styles.chatAberto : ''}`} 
                title="Atendimento automático"
                onClick={handleToggle} // Usa a nova função de toggle
            >
                <span className={styles.tooltipFlutuante}>Quer ajuda?</span>
                <RobotIcon />
            </button>

            <div 
                id="popupChat" 
                ref={popupRef}
                
                className={`${styles.popupChat} ${isOpen ? styles.aberto : ''} ${isClosing ? styles.fechando : ''}`}
            >
                <div className={styles.cabecalhoChat}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <img 
                            src="/img/chatbot/SÍMBOLO SERVIÇOS JÁ.png" 
                            alt="Logo Serviços Já" 
                            className={styles.cabecalhoLogo} 
                        />
                        <h4 style={{margin:0, color: 'white'}}>Suporte Serviços Já</h4>
                    </div>
                    <button 
                        className={styles.fecharChat}
                        onClick={handleClose} // Usa a nova função de fechar
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
                            onNumericOptionClick={handleNumericOptionClick} 
                        />
                    ))}
                    {isTyping && <Message type="bot" content="Digitando..." />}
                </div>

                <div className={styles.entradaChat}>
                    <input 
                        type="text" 
                        id="textoChat"
                        className={styles.textoChat}
                        placeholder="Digite sua mensagem..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                    />
                    <button 
                        className={styles.enviarChat}
                        onClick={() => sendMessage()}
                        disabled={isTyping}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;