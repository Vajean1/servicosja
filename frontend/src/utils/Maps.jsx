// MapaSimples.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 

import CustomIconSvg from '/img/logo/mapa.svg'; 

const RecenterMap = ({ lat, long }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, long]);
    }, [lat, long, map]);
    return null;
};

const Maps = ({ long, lat }) => {
    const position = [lat, long];

    
    const customIcon = L.icon({
        iconUrl: CustomIconSvg,
        iconSize: [300, 300],
        iconAnchor: [150, 185], 
        popupAnchor: [0, -38]
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
            
            <RecenterMap lat={lat} long={long} />

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
