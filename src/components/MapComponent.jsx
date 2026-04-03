import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { haversineDistance } from '../data/CollegeData';

// Fix for Leaflet default icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom highlighted marker icon (orange/gold)
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map view updates
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ userLocation, colleges, onMarkerClick, selectedCollegeId }) => {
  return (
    <div className="w-full h-full relative group">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        className="z-10 leaflet-dark"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={userLocation} />

        {/* User Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup className="custom-popup">
            <div className="text-center p-2">
              <p className="font-bold text-background">You are here</p>
            </div>
          </Popup>
        </Marker>

        {/* College Markers */}
        {colleges.map((college) => {
          const distance = haversineDistance(
            userLocation.lat,
            userLocation.lng,
            college.lat,
            college.lng
          );

          const isSelected = selectedCollegeId === college.id;

          return (
            <Marker 
              key={college.id} 
              position={[college.lat, college.lng]}
              icon={isSelected ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) {
                    onMarkerClick(college, distance);
                  }
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-background mb-1">{college.name}</h3>
                  <p className="text-xs text-background opacity-70 mb-2">{college.address}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase text-primary">
                      {college.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-background">
                      {distance} km away
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Styling for Dark Theme */}
      <style>{`
        .leaflet-dark .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-container {
          background: #0a0a0a !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          color: #0a0a0a;
          border-radius: 12px;
          padding: 4px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-bar a {
          background-color: #1e1e24 !important;
          color: white !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
      `}
      </style>
    </div>
  );
};

export default MapComponent;
