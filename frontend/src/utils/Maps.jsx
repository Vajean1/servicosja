// MapaSimples.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Importa o objeto 'Icon' de Leaflet
import L from 'leaflet'; 

// 1. Importe sua imagem SVG (ajuste o caminho se necessário)
import CustomIconSvg from '/img/logo/mapa.svg'; 

const Maps = ({ long, lat }) => {
    const position = [lat, long];

    // 2. Cria o ícone customizado usando L.icon
    // Você precisa definir o caminho da imagem e as dimensões corretas
    // O 'iconSize' define o tamanho da imagem.
    // O 'iconAnchor' define o ponto do ícone que deve estar sobre as coordenadas (normalmente o meio-inferior).
    const customIcon = L.icon({
        iconUrl: CustomIconSvg,
        iconSize: [300, 300], // Exemplo: 38px de largura por 38px de altura. Ajuste conforme sua SVG.
        iconAnchor: [150, 185], // Exemplo: O centro da base do ícone (metade de iconSize[0], valor total de iconSize[1])
        popupAnchor: [0, -38] // Define onde o Popup será ancorado em relação ao ícone
    });

    return (
        <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '500px', width: '100%' }} // Estilo obrigatório
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 3. Passa a propriedade 'icon' para o componente Marker */}
            <Marker position={position} icon={customIcon}>
                <Popup>
                    Este é um exemplo de marcador com um ícone customizado.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Maps;