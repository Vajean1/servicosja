import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import styles from './EditProviderModal.module.css';
import { useAuth } from '../../context/AuthContext';
import UserServices from '../../services/user';
import ProviderServices from '../../services/provider';
import Loading2 from '../../pages/loading/loading2';

const getErrorMessage = (formErrors, fieldName) => {
    if (formErrors && formErrors[fieldName] && Array.isArray(formErrors[fieldName]) && formErrors[fieldName].length > 0) {
        return formErrors[fieldName][0];
    }
    return null;
};

export default function EditProviderModal({ open, close, providerData, onUpdate }) {
    const [formData, setFormData] = useState({
        nome_completo: '',
        telefone_publico: '',
        biografia: '',
        disponibilidade: '',
        atende_fim_de_semana: '',
        possui_material_proprio: '',
        cep: '',
        rua: '',
        numero_casa: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Obtém a URL da foto existente para exibição
    const existingPhotoUrl = providerData?.foto_url;

    // Limpa a URL de preview
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

 
    const { updateUser, getMe } = UserServices();
    const { user, setAuthData } = useAuth();

    useEffect(() => {
        if (open) {
            getMe()
                .then((userData) => {
                    const perfil = userData.perfil_prestador || {};
                    setFormData({
                        nome_completo: userData.nome || userData.nome_completo || '', 
                        telefone_publico: perfil.telefone_publico || '',
                        biografia: perfil.biografia || '',
                        
                        // Converte booleanos (ou undefined) para string 'true'/'false'
                        disponibilidade: String(perfil.disponibilidade ?? 'false'),
                        atende_fim_de_semana: String(perfil.atende_fim_de_semana ?? 'false'),
                        possui_material_proprio: String(perfil.possui_material_proprio ?? 'false'),
                        
                        cep: perfil.cep || '',
                        rua: perfil.rua || '',
                        numero_casa: perfil.numero_casa || ''
                    });
                })
                .catch((error) => {
                    console.error("Erro ao carregar dados do usuário:", error);
                });
        }
    }, [open]); 
    const { updateProviderProfile } = ProviderServices();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
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
        setLoading(true);
        setFormErrors({});

        try {
            // 1. Atualiza campos de texto e booleanos
            const payload = {
                nome_completo: formData.nome_completo,
                perfil_prestador: {
                    telefone_publico: formData.telefone_publico,
                    biografia: formData.biografia && formData.biografia.trim() !== '' ? formData.biografia : 'sem biografia',
                    disponibilidade: formData.disponibilidade === 'true',
                    atende_fim_de_semana: formData.atende_fim_de_semana === 'true',
                    possui_material_proprio: formData.possui_material_proprio === 'true',
                    cep: formData.cep,
                    rua: formData.rua,
                    numero_casa: formData.numero_casa
                }
            };

            const updatedUser = await updateUser(payload);

            // 2. Atualiza foto, se uma nova foi selecionada
            if (selectedPhoto) {
                const photoFormData = new FormData();
                photoFormData.append('foto_perfil', selectedPhoto);
                await updateProviderProfile(photoFormData);
            }
            
            if (updatedUser) {
                setAuthData({ 
                    ...user, 
                    ...updatedUser,
                    nome: formData.nome_completo 
                });
            }

            if (onUpdate) onUpdate();
            close();
        } catch (error) {
            console.error("Failed to update profile", error);
            if (error && typeof error === 'object') {
                setFormErrors(error);
            } else {
                alert("Erro ao atualizar perfil. Verifique os dados.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={close}>
            <div className={styles.modalContent}>
                {loading ? <Loading2 /> : (
                    <>
                        <h2>Editar Perfil</h2>
                        <form onSubmit={handleSubmit}>
                            {(previewUrl || existingPhotoUrl) && (
                                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                    <img 
                                        src={previewUrl || existingPhotoUrl} 
                                        alt="Preview" 
                                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                                    />
                                </div>
                            )}

                            {/* --- Campos de Texto Controlados --- */}
                            <label>Nome:</label>
                            {getErrorMessage(formErrors, 'nome_completo') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'nome_completo')}</p>
                            )}
                            <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome" required />
                            
                            <label>Telefone Público:</label>
                            {getErrorMessage(formErrors, 'telefone_publico') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'telefone_publico')}</p>
                            )}
                            <input name="telefone_publico" value={formData.telefone_publico} onChange={handleChange} placeholder="Telefone" />
                            
                            {/* --- Campos de Seleção Controlados --- */}
                            <label>Disponibilidade 24h:</label>
                            {getErrorMessage(formErrors, 'disponibilidade') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'disponibilidade')}</p>
                            )}
                            <select name="disponibilidade" value={formData.disponibilidade} onChange={handleChange} required>
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>

                            <label>Atende Final de Semana:</label>
                            {getErrorMessage(formErrors, 'atende_fim_de_semana') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'atende_fim_de_semana')}</p>
                            )}
                            <select name="atende_fim_de_semana" value={formData.atende_fim_de_semana} onChange={handleChange} required>
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>

                            <label>Possui Material Próprio:</label>
                            {getErrorMessage(formErrors, 'possui_material_proprio') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'possui_material_proprio')}</p>
                            )}
                            <select name="possui_material_proprio" value={formData.possui_material_proprio} onChange={handleChange} required>
                                <option value="true">Sim</option>
                                <option value="false">Não</option>
                            </select>

                            <label>CEP:</label>
                            {getErrorMessage(formErrors, 'cep') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'cep')}</p>
                            )}
                            <input name="cep" value={formData.cep} onChange={handleChange} placeholder="CEP" />

                            <label>Rua:</label>
                            {getErrorMessage(formErrors, 'rua') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'rua')}</p>
                            )}
                            <input name="rua" value={formData.rua} onChange={handleChange} placeholder="Rua" />

                            <label>Número:</label>
                            {getErrorMessage(formErrors, 'numero_casa') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'numero_casa')}</p>
                            )}
                            <input name="numero_casa" value={formData.numero_casa} onChange={handleChange} placeholder="Número" />

                            <label>Biografia:</label>
                            {getErrorMessage(formErrors, 'biografia') && (
                                <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'biografia')}</p>
                            )}
                            <textarea name="biografia" value={formData.biografia} onChange={handleChange} placeholder="Biografia" />
                            
                            <button type="submit">Salvar</button>
                        </form>
                    </>
                )}
            </div>
        </Dialog>
    );
}
