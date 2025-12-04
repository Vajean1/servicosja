// MapaSimples.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas centrais para o mapa
// Exemplo: São Paulo

const Maps = ({long , lat}) => {
    const position = [lat, long]; 

    
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
  
      <Marker position={position}>
        <Popup>
          Este é um exemplo de marcador em São Paulo.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Maps;