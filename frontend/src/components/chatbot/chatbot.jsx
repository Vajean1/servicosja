import styles from './chatbot.module.css'
import {Dialog} from '@mui/material'


export default function Chatbot () {
    return (
        <>
            <img className={styles.chatIcon} src="/img/chatbot/Icon chat.svg" alt="" />
            <Dialog open={true}>
               <div className={styles.popup}>
                 <div className={styles.popupMenu}>
                    <h2>Suporte Serviços Já</h2>
                    <h2>X</h2>
                 </div>
               </div>

            </Dialog>
        </>
    )   
}