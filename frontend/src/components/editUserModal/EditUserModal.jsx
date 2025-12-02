import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import styles from './EditUserModal.module.css';
import UserServices from '../../services/user';

export default function EditUserModal({ open, close, userData, onUpdate }) {
    const [formData, setFormData] = useState({
        nome_completo: '',
    });

    useEffect(() => {
        if (userData) {
            // Adjust based on what data is passed. UserPerfil passes 'profileData' which has 'nome_completo'
            setFormData({
                nome_completo: userData.nome_completo || '', 
            });
        }
    }, [userData]);
    
    const { updateUser } = UserServices();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser({ nome_completo: formData.nome_completo });
            if (onUpdate) onUpdate();
            close();
        } catch (error) {
            console.error("Failed to update user profile", error);
            alert("Erro ao atualizar perfil. Tente novamente.");
        }
    };

    return (
        <Dialog open={open} onClose={close}>
            <div className={styles.modalContent}>
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome Completo:</label>
                    <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome Completo" />
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </Dialog>
    );
}
