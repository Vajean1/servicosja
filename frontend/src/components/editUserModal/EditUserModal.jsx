import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@mui/material';
import styles from './EditUserModal.module.css';
import UserServices from '../../services/user';

import ImageCropModal from '../../utils/ImageCropModal'; 
import Loading2 from '../../pages/loading/loading2';

const getErrorMessage = (formErrors, fieldName) => {
    if (formErrors && formErrors[fieldName] && Array.isArray(formErrors[fieldName]) && formErrors[fieldName].length > 0) {
        return formErrors[fieldName][0];
    }
    return null;
};

export default function EditUserModal({ open, close, userData, onUpdate }) {
    const [formData, setFormData] = useState({
        nome_completo: '',
        dt_nascimento: '',
        rua: '',
        numero_casa: '',
        cep: '',
        telefone_contato: ''
    });

    const [formErrors, setFormErrors] = useState({});

    // Estado para a foto de perfil 
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    // Estado para a URL de visualização
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // estados para o modal de corte
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    // URL da imagem selecionada antes do corte
    const [imageToCrop, setImageToCrop] = useState(null); 
    const [loading, setLoading] = useState(false);

    // Efeito para preencher o formulário com dados do usuário
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
            // Adiciona a foto de perfil existente para visualização, se houver
            if (userData.perfil_cliente?.foto_perfil) {
                setPreviewUrl(userData.perfil_cliente.foto_perfil);
            } else {
                setPreviewUrl(null);
            }
            setSelectedPhoto(null); // Limpa a foto recém-selecionada ao abrir
        }
    }, [userData]);

    // Efeito para limpar URLs de objetos
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
            if (imageToCrop && imageToCrop.startsWith('blob:')) {
                 URL.revokeObjectURL(imageToCrop);
            }
        };
    }, [previewUrl, imageToCrop]);
    
    const { updateUser, updateClientProfile } = UserServices();

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

    /**
     * @function handlePhotoChange
     * Gerencia a seleção inicial do arquivo e abre o modal de corte.
     */
    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileUrl = URL.createObjectURL(file);
            
            // 1. Define a URL da imagem ORIGINAL para o Cropper
            setImageToCrop(fileUrl);
            
            // 2. Abre o modal de corte
            setIsCropModalOpen(true);
            
            // O componente Cropper não usa o `file` diretamente, mas sim a URL.
            // O file será gerado **após** o corte.
        }
    };
    
    /**
     * @function onCropComplete
     * Chamada quando o corte é salvo no ImageCropModal.
     * @param {Blob} croppedImageBlob - O Blob do arquivo cortado.
     */
    const handleCropComplete = useCallback((croppedImageBlob) => {
        // 1. Cria um objeto File a partir do Blob para o envio
        const croppedFile = new File([croppedImageBlob], "profile_photo.jpeg", { type: croppedImageBlob.type });
        
        // 2. Define o arquivo cortado para ser enviado
        setSelectedPhoto(croppedFile);
        
        // 3. Cria uma URL de visualização para o preview
        const newPreviewUrl = URL.createObjectURL(croppedImageBlob);
        
        // Limpa a URL de preview antiga se for um blob
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        
        // 4. Define a nova URL de preview
        setPreviewUrl(newPreviewUrl);
        
        // 5. Fecha o modal de corte e limpa a imagem original
        setIsCropModalOpen(false);
        if (imageToCrop && imageToCrop.startsWith('blob:')) {
             URL.revokeObjectURL(imageToCrop);
        }
        setImageToCrop(null);
        
        
        document.getElementById('profile-photo-input').value = '';
        
    }, [previewUrl, imageToCrop]);

    /**
     * @function handleCloseCropModal
     * Fecha o modal de corte e limpa a imagem original.
     */
    const handleCloseCropModal = useCallback(() => {
        setIsCropModalOpen(false);
        if (imageToCrop && imageToCrop.startsWith('blob:')) {
             URL.revokeObjectURL(imageToCrop);
        }
        setImageToCrop(null);
        document.getElementById('profile-photo-input').value = '';
    }, [imageToCrop]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormErrors({});
        
        try {
            const userPayload = {
                nome_completo: formData.nome_completo,
                dt_nascimento: formData.dt_nascimento
            };
            await updateUser(userPayload);

            const profileFormData = new FormData();
            
            profileFormData.append('telefone_contato', formData.telefone_contato || '');
            profileFormData.append('rua', formData.rua || '');
            profileFormData.append('numero_casa', formData.numero_casa || '');
            profileFormData.append('cep', formData.cep || '');

            // Usa a foto CORTADA 
            if (selectedPhoto) {
                profileFormData.append('foto_perfil', selectedPhoto);
            }
            // Se selectedPhoto for null, nenhuma foto nova será enviada, mantendo a foto existente no backend 

            await updateClientProfile(profileFormData);

            if (onUpdate) onUpdate();
            close();
            // Limpa estado da foto após o envio
            setSelectedPhoto(null);
            setPreviewUrl(null); // O preview é atualizado pelo onUpdate
            
        } catch (error) {
            console.error("Failed to update user profile", error);
            if (error && typeof error === 'object') {
                setFormErrors(error);
            } else {
                alert("Erro ao atualizar perfil. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Modal Principal de Edição */}
            <Dialog open={open} onClose={close}>
                <div className={styles.modalContent}>
                    {loading ? <Loading2 /> : (
                    <>
                    <h2>Editar Perfil</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Foto de Perfil:</label>
                        <input 
                            id="profile-photo-input"
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoChange} 
                            style={{marginBottom: '10px'}} 
                        />
                        
                        {(previewUrl || userData?.perfil_cliente?.foto_perfil) && (
                            <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                                <img 
                                    src={previewUrl || userData.perfil_cliente.foto_perfil} // Exibe preview ou foto existente
                                    alt="Preview" 
                                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }} 
                                />
                            </div>
                        )}

                        <label>Nome Completo:</label>
                        {getErrorMessage(formErrors, 'nome_completo') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'nome_completo')}</p>
                        )}
                        <input name="nome_completo" value={formData.nome_completo} onChange={handleChange} placeholder="Nome Completo" />
                        
                        <label>Data de Nascimento:</label>
                        {getErrorMessage(formErrors, 'dt_nascimento') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'dt_nascimento')}</p>
                        )}
                        <input name="dt_nascimento" value={formData.dt_nascimento} onChange={handleChange} placeholder="AAAA-MM-DD" /> {/* Dica: use type="date" ou mask/validação */}

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

                        <label>CEP:</label>
                        {getErrorMessage(formErrors, 'cep') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'cep')}</p>
                        )}
                        <input name="cep" value={formData.cep} onChange={handleChange} placeholder="CEP" />

                        <label>Telefone de Contato:</label>
                        {getErrorMessage(formErrors, 'telefone_contato') && (
                            <p className={styles.errorMessage}>{getErrorMessage(formErrors, 'telefone_contato')}</p>
                        )}
                        <input name="telefone_contato" value={formData.telefone_contato} onChange={handleChange} placeholder="Telefone" />

                        <button type="submit">Salvar</button>
                    </form>
                    </>
                    )}
                </div>
            </Dialog>

            {/* Modal de Corte de Imagem */}
            {isCropModalOpen && imageToCrop && (
                <ImageCropModal
                    image={imageToCrop}
                    onCropComplete={handleCropComplete} // Recebe o Blob cortado
                    onClose={handleCloseCropModal}
                />
            )}
        </>
    );
}
