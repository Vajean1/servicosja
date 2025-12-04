import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import styles from './EditUserModal.module.css';
import UserServices from '../../services/user';

export default function EditUserModal({ open, close, userData, onUpdate }) {
    const [formData, setFormData] = useState({
        nome_completo: '',
        dt_nascimento: '',
        rua: '',
        numero_casa: '',
        cep: '',
        telefone_contato: ''
    });

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (userData) {
            setFormData({
                nome_completo: userData.nome_completo || '', 
                dt_nascimento: userData.dt_nascimento || userData.perfil_cliente?.dt_nascimento || '',
                rua: userData.perfil_cliente?.rua || userData.rua || '',
                numero_casa: userData.perfil_cliente?.numero_casa || userData.numero_casa || '',
                cep: userData.perfil_cliente?.cep || userData.cep || '',
                telefone_contato: userData.perfil_cliente?.telefone_contato || userData.telefone_contato || ''
            });
        }
    }, [userData]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    
    const { updateUser, updateClientProfile } = UserServices();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Atualiza dados de User (Nome e Nascimento) via JSON para /me
            const userPayload = {
                nome_completo: formData.nome_completo,
                dt_nascimento: formData.dt_nascimento
            };
            await updateUser(userPayload);

            // 2. Atualiza dados de Perfil (Endereço, Telefone, Foto) via FormData para /perfil/cliente/editar/
            const profileFormData = new FormData();
            
            // Campos planos conforme nova documentação
            profileFormData.append('telefone_contato', formData.telefone_contato || '');
            profileFormData.append('rua', formData.rua || '');
            profileFormData.append('numero_casa', formData.numero_casa || '');
            profileFormData.append('cep', formData.cep || '');

            if (selectedPhoto) {
                profileFormData.append('foto_perfil', selectedPhoto);
            }

            await updateClientProfile(profileFormData);

            if (onUpdate) onUpdate();
            close();
            // Limpa estado da foto
            setSelectedPhoto(null);
            setPreviewUrl(null);
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
                    <label>Foto de Perfil:</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{marginBottom: '10px'}} />
                    
                    {previewUrl && (
                        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                            />
                        </div>
                    )}

                    <label>Nome Completo:</label>
                    <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome Completo" />
                    
                    <label>Data de Nascimento:</label>
                    <input name="dt_nascimento" value={formData.dt_nascimento} onChange={handleChange} placeholder="Data de Nascimento" />

                    <label>Rua:</label>
                    <input name="rua" value={formData.rua} onChange={handleChange} placeholder="Rua" />

                    <label>Número:</label>
                    <input name="numero_casa" value={formData.numero_casa} onChange={handleChange} placeholder="Número" />

                    <label>CEP:</label>
                    <input name="cep" value={formData.cep} onChange={handleChange} placeholder="CEP" />

                    <label>Telefone de Contato:</label>
                    <input name="telefone_contato" value={formData.telefone_contato} onChange={handleChange} placeholder="Telefone" />

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </Dialog>
    );
}
