import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getEventImage } from '../utils/eventImages';

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const eventIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Example icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const MapComponent = ({ events = [], userLocation, height = '400px' }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const hasValidUserLocation =
    userLocation &&
    typeof userLocation.latitude === 'number' &&
    typeof userLocation.longitude === 'number' &&
    !isNaN(userLocation.latitude) &&
    !isNaN(userLocation.longitude);

  const defaultPosition = hasValidUserLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [40.7128, -74.0060]; // Default to NYC

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-700">
      <MapContainer center={defaultPosition} zoom={12} style={{ height, width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {userLocation && (
          <Marker position={defaultPosition} icon={userIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        {events.map((event) => {
          const coords = event.coordinates?.coordinates;
          const lat = Array.isArray(coords) ? coords[1] : undefined;
          const lng = Array.isArray(coords) ? coords[0] : undefined;
          if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
            return null;
          }
          return (
            <Marker
              key={event._id}
              position={[lat, lng]}
              icon={eventIcon}
              eventHandlers={{
                click: () => setSelectedEvent(event)
              }}
            >
              {selectedEvent && selectedEvent._id === event._id && (
                <Popup onClose={() => setSelectedEvent(null)}>
                  <div className="p-2 max-w-xs">
                    <img
                      src={getEventImage(selectedEvent.category)}
                      alt={selectedEvent.title}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{selectedEvent.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{selectedEvent.location}</p>
                    <button
                      onClick={() => window.open(`/events/${selectedEvent._id}`, '_blank')}
                      className="bg-yellow-400 text-gray-900 px-3 py-1 rounded text-sm font-medium hover:bg-yellow-500 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;