import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import styles from './EditProviderModal.module.css';
import ProviderServices from '../../services/provider';
import UserServices from '../../services/user';

export default function EditProviderModal({ open, close, providerData, onUpdate }) {
    const [formData, setFormData] = useState({
        nome_completo: '',
        telefone_publico: '',
        biografia: '',
    });

    useEffect(() => {
        if (providerData) {
            setFormData({
                nome_completo: providerData.nome || '',
                telefone_publico: providerData.telefone_publico || '',
                biografia: providerData.biografia || '',
            });
        }
    }, [providerData]);
    
    const { updateProvider } = ProviderServices();
    const { updateUser } = UserServices();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update User fields (Name) if changed
            if (formData.nome_completo !== providerData.nome) {
                 await updateUser({ nome_completo: formData.nome_completo });
            }
            
            // Update Provider fields (Bio, Phone)
            await updateProvider({
                telefone_publico: formData.telefone_publico,
                biografia: formData.biografia
            });
            
            if (onUpdate) onUpdate();
            close();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Erro ao atualizar perfil. Verifique os dados.");
        }
    };

    return (
        <Dialog open={open} onClose={close}>
            <div className={styles.modalContent}>
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome:</label>
                    <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome" />
                    <label>Telefone Público:</label>
                    <input name="telefone_publico" value={formData.telefone_publico} onChange={handleChange} placeholder="Telefone" />
                    <label>Biografia:</label>
                    <textarea name="biografia" value={formData.biografia} onChange={handleChange} placeholder="Biografia" />
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </Dialog>
    );
}
