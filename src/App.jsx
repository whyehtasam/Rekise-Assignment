import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import DisplayInfo from "./DisplayInfo";

// Define custom icons for the start, end, and moving markers
const startIcon = L.icon({
  iconUrl: "/starting.png",
  iconSize: [32, 32],
  iconAnchor: [16, 17],
  popupAnchor: [0, -32],
});

const endIcon = L.icon({
  iconUrl: "/ending.png",
  iconSize: [32, 32],
  iconAnchor: [16, 17],
  popupAnchor: [0, -32],
});

const movingIcon = L.icon({
  iconUrl: "/ship.png",
  iconSize: [16, 80],
  iconAnchor: [16, 80],
  popupAnchor: [0, -80],
  className: "moving-icon",
});

const startCoords = [22.1696, 91.4996];
const endCoords = [22.2637, 91.7159];

function VesselMap() {
  const [speedKmh, setSpeedKmh] = useState(20);
  const refreshRateMs = 500;
  const [position, setPosition] = useState(startCoords);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const totalDistance = calculateDistance(startCoords, endCoords);

  useEffect(() => {
    setTotalTimeMs((totalDistance / speedKmh) * 3600 * 1000);
  }, [speedKmh, totalDistance]);

  useEffect(() => {
    if (elapsedTime < totalTimeMs) {
      const intervalId = setInterval(() => {
        setElapsedTime((prevTime) =>
          Math.min(prevTime + refreshRateMs, totalTimeMs)
        );
      }, refreshRateMs);

      return () => clearInterval(intervalId);
    }
  }, [elapsedTime, totalTimeMs, refreshRateMs]);

  useEffect(() => {
    const fraction = elapsedTime / totalTimeMs;
    const newPosition = interpolatePosition(startCoords, endCoords, fraction);
    if (newPosition.every(val => !isNaN(val))) {
      setPosition(newPosition);
    }
  }, [elapsedTime, totalTimeMs]);

  const increaseSpeed = () => setSpeedKmh((prevSpeed) => prevSpeed + 50);
  const decreaseSpeed = () => setSpeedKmh((prevSpeed) => Math.max(prevSpeed - 50, 0));

  return (
    <div className="container-map">
      <DisplayInfo
        totalDistance={totalDistance}
        totalTimeMs={totalTimeMs}
        elapsedTime={elapsedTime}
        speedKmh={speedKmh}
        position={position}
        increaseSpeed={increaseSpeed}
        decreaseSpeed={decreaseSpeed}
      />
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={startCoords} icon={startIcon} />
        <Marker position={endCoords} icon={endIcon} />
        {position.every(val => !isNaN(val)) && (
          <Marker position={position} icon={movingIcon} />
        )}
        <Polyline
          positions={[startCoords, position]}
          color="blue"
          weight={5}
          opacity={0.7}
        />
      </MapContainer>
    </div>
  );
}

function calculateDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function interpolatePosition(start, end, fraction) {
  const lat = start[0] + (end[0] - start[0]) * fraction;
  const lon = start[1] + (end[1] - start[1]) * fraction;
  return [lat, lon];
}

export default VesselMap;
