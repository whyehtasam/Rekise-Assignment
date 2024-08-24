import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fixing the default icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define custom icons for the start, end, and moving markers
const startIcon = L.icon({
  iconUrl: '/starting.png', // Path to your start PNG
  iconSize: [32, 32], // Adjust size as needed
  iconAnchor: [16, 32], // Anchor point so the icon is centered
  popupAnchor: [0, -32],
});

const endIcon = L.icon({
  iconUrl: '/ending.png', // Path to your end PNG
  iconSize: [32, 32], // Adjust size as needed
  iconAnchor: [16, 32], // Anchor point so the icon is centered
  popupAnchor: [0, -32],
});

const movingIcon = L.icon({
  iconUrl: '/ship.png', // Path to your moving PNG
  iconSize: [32, 80], // Adjust size as needed
  iconAnchor: [16, 80], // Adjust anchor to the bottom center
  popupAnchor: [0, -80],
  className: 'moving-icon', // Add a custom class for rotation
});

// Utility function to calculate distance between two coordinates (Haversine formula)
function calculateDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Utility function to calculate next position based on a fraction of the journey completed
function interpolatePosition(start, end, fraction) {
  const lat = start[0] + (end[0] - start[0]) * fraction;
  const lon = start[1] + (end[1] - start[1]) * fraction;
  return [lat, lon];
}

function VesselMap() {
  const startCoords = [22.1696, 91.4996];
  const endCoords = [22.2637, 91.7159];
  const speedKmh = 20; // Speed in km/h
  const refreshRateMs = 500; // 2 FPS (500ms refresh rate)
  const totalDistance = calculateDistance(startCoords, endCoords);

  // Total time to complete the journey in milliseconds
  const totalTimeMs = (totalDistance / speedKmh) * 3600 * 1000; 

  const [position, setPosition] = useState(startCoords);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Only start the interval if there is still time remaining
    if (elapsedTime < totalTimeMs) {
      const intervalId = setInterval(() => {
        setElapsedTime((prevTime) => Math.min(prevTime + refreshRateMs, totalTimeMs));
      }, refreshRateMs);

      // Clean up the interval when the effect reruns or the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [elapsedTime, totalTimeMs, refreshRateMs]);

  useEffect(() => {
    // Calculate the fraction of the journey completed
    const fraction = elapsedTime / totalTimeMs;
    const newPosition = interpolatePosition(startCoords, endCoords, fraction);
    setPosition(newPosition);
  }, [elapsedTime, startCoords, endCoords, totalTimeMs]);

  return (
    <MapContainer center={position} zoom={12} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Start Marker */}
      <Marker position={startCoords} icon={startIcon} />
      
      {/* End Marker */}
      <Marker position={endCoords} icon={endIcon} />
      
      {/* Moving Vessel Marker */}
      <Marker position={position} icon={movingIcon} />
      
      <Polyline positions={[startCoords, position]} color="blue" />
    </MapContainer>
  );
}

export default VesselMap;
