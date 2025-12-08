import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImageUtil'; 
import styles from './ImageCropModal.module.css'; 

const ImageCropModal = ({ image, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setZoom(zoom);
    }, []);

    const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = useCallback(async () => {
        if (!croppedAreaPixels){
            console.error("Área de corte não definida!");
            return;
        }
        
        try {
            const croppedImageBlob = await getCroppedImg(
                image,
                croppedAreaPixels
            );
            
            // onCropComplete recebe o Blob (arquivo) cortado
            onCropComplete(croppedImageBlob);
            
        } catch (e) {
            console.error("Erro ao aplicar o corte:", e);
            alert("Erro ao cortar a imagem. Tente novamente.");
        }
    }, [image, croppedAreaPixels, onCropComplete]);


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Cortar Imagem de Perfil</h2>
                
                <div className={styles.cropperContainer}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Proporção 1:1 para foto de perfil
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropAreaChange}
                        cropShape="round" // Forma redonda
                        showGrid={true}
                    />
                </div>

                <div className={styles.controls}>
                    <label htmlFor="zoom-slider">Zoom:</label>
                    <input
                        id="zoom-slider"
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                        className={styles.slider}
                    />
                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={onClose}>
                            Cancelar
                        </button>
                        <button className={styles.saveButton} onClick={handleSave} disabled={!croppedAreaPixels}>
                            Salvar Corte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;