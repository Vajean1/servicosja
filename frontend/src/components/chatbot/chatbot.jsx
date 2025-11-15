import { useState } from 'react'


import styles from './chatbot.module.css'
import {Dialog} from '@mui/material'
import { FaPaperclip } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";


export default function Chatbot () {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        // Lógica para fechar o popup
        setOpen(!open);
    }   

    return (
        <>
            <img onClick={handleClose}  className={styles.chatIcon} src="/img/chatbot/Icon chat.svg" alt="" />
            <Dialog  className={styles.popupContainer} onClose={handleClose} open={open}>
               <div className={styles.popup}>
                    <div className={styles.popupMenu}>
                        <img src="/img/logo/Simbolo.svg" alt="Logo serviços já" />
                        <h2>Suporte Serviços Já</h2>
                        <div onClick={() => handleClose()} className={styles.exitIcon}>
                            <IoExitOutline />
                        </div>
                    </div>

                    <div className={styles.popupBody}>
                        <div className={styles.messageBot}>
                            <p>Olá! Eu sou o assistente virtual do Serviços Já. Como posso ajudar você hoje?</p>
                        </div>
                    </div>

                    <div className={styles.popupFooter}>
                        <FaPaperclip />
                        <input type="text" placeholder='Digite sua mensagem...' />
                        <button>Enviar</button>
                    </div>
               </div>

            </Dialog>
        </>
    )   
}