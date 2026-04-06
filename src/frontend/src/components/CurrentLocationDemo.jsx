import { useState } from 'react';
import MapSelector from './MapSelector';

export default function CurrentLocationDemo() {
  const [selectedCoords, setSelectedCoords] = useState({ lat: null, lng: null });

  const handleLocationSelect = (latitude, longitude) => {
    setSelectedCoords({ lat: latitude, lng: longitude });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Current Location Feature Demo</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>How to Use:</h3>
        <ol>
          <li>Click the <strong>location button</strong> (blue circle with GPS icon) in the top-right corner of the map</li>
          <li>Grant location permission when prompted by your browser</li>
          <li>The map will center on your current location and place a marker there</li>
          <li>The coordinates will be automatically filled below</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <MapSelector
          latitude={selectedCoords.lat}
          longitude={selectedCoords.lng}
          onLocationSelect={handleLocationSelect}
          height="400px"
        />
      </div>

      <div style={{
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3>Selected Coordinates:</h3>
        {selectedCoords.lat && selectedCoords.lng ? (
          <div>
            <p><strong>Latitude:</strong> {selectedCoords.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {selectedCoords.lng.toFixed(6)}</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px' }}>
              These coordinates are now ready to be saved to your location record.
            </p>
          </div>
        ) : (
          <p style={{ color: '#6b7280' }}>No location selected yet. Click on the map or use the current location button.</p>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
        <h3>Features:</h3>
        <ul>
          <li>📍 <strong>Current Location Button:</strong> One-click GPS location detection</li>
          <li>🎯 <strong>Automatic Centering:</strong> Map centers on your location</li>
          <li>📌 <strong>Marker Placement:</strong> Visual marker shows exact position</li>
          <li>⚡ <strong>Auto-fill:</strong> Coordinates automatically populate form fields</li>
          <li>🛡️ <strong>Privacy:</strong> Requires explicit user permission</li>
          <li>📱 <strong>Mobile Friendly:</strong> Works on phones and tablets</li>
        </ul>
      </div>
    </div>
  );
}