import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Current location button component
function CurrentLocationButton({ onGetCurrentLocation }) {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000
    }}>
      <button
        onClick={onGetCurrentLocation}
        style={{
          background: 'white',
          border: '2px solid #1a3fd4',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
        title="Get current location"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a3fd4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </button>
    </div>
  );
}

// Map controller to handle map centering
function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

function LocationMarker({ position, onPositionChange }) {
  const [markerPosition, setMarkerPosition] = useState(position);

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(newPos);
      onPositionChange(newPos);
    },
  });

  return markerPosition ? (
    <Marker position={markerPosition} />
  ) : null;
}

export default function MapSelector({ latitude, longitude, onLocationSelect, height = "300px" }) {
  const defaultCenter = [6.9271, 79.8612]; // Colombo, Sri Lanka as default
  const hasValidCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const initialPosition = hasValidCoordinates ? [latitude, longitude] : null;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState(initialPosition || defaultCenter);

  useEffect(() => {
    if (hasValidCoordinates) {
      setMapCenter([latitude, longitude]);
    }
  }, [hasValidCoordinates, latitude, longitude]);

  const handlePositionChange = (newPosition) => {
    onLocationSelect(newPosition[0], newPosition[1]);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);

    const applyPosition = (position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      const currentPos = [lat, lng];

      setCurrentLocation(currentPos);
      setMapCenter(currentPos);
      onLocationSelect(lat, lng);
      setIsGettingLocation(false);
    };

    const handleLocationError = (error) => {
      console.error('Error getting location:', error);
      setIsGettingLocation(false);

      let errorMessage = 'Unable to get your location. ';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location access denied by user. Please allow location permission in your browser.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable on this device/network.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage += 'An unknown error occurred.';
          break;
      }

      alert(errorMessage);
    };

    // Prefer a fresh, high-accuracy reading first.
    navigator.geolocation.getCurrentPosition(
      applyPosition,
      (error) => {
        // Fallback for devices/browsers that cannot provide high-accuracy quickly.
        if (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE) {
          navigator.geolocation.getCurrentPosition(
            applyPosition,
            handleLocationError,
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 60000,
            }
          );
          return;
        }

        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={currentLocation || initialPosition ? 15 : 10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={currentLocation || initialPosition}
          onPositionChange={handlePositionChange}
        />
        <MapController center={mapCenter} />
      </MapContainer>

      <CurrentLocationButton onGetCurrentLocation={handleGetCurrentLocation} />

      {isGettingLocation && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          background: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '14px',
          color: '#1a3fd4',
          zIndex: 1000
        }}>
          Getting your location...
        </div>
      )}
    </div>
  );
}