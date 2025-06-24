import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function LocationMarker({ onLocationSelect, selectedLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Reverse geocode using Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          onLocationSelect({
            coordinates: [lng, lat],
            address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            venue: data.display_name || 'Selected Location'
          });
        });
    }
  });
  return selectedLocation ? (
    <Marker position={selectedLocation} icon={markerIcon} />
  ) : null;
}

const LocationPicker = ({ onLocationSelect, initialLocation, className = '' }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation ? [initialLocation.lat || initialLocation.latitude, initialLocation.lng || initialLocation.longitude] : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const defaultCenter = selectedLocation || [40.7128, -74.0060];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Geocode using Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(results => {
        setIsSearching(false);
        if (results && results.length > 0) {
          const loc = results[0];
          const lat = parseFloat(loc.lat);
          const lng = parseFloat(loc.lon);
          setSelectedLocation([lat, lng]);
          onLocationSelect({
            coordinates: [lng, lat],
            address: loc.display_name,
            venue: loc.display_name
          });
        } else {
          alert('Location not found. Please try a different search term.');
        }
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a location..."
            className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 pl-10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <MapContainer center={defaultCenter} zoom={selectedLocation ? 15 : 10} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationMarker
            onLocationSelect={(loc) => {
              setSelectedLocation([loc.coordinates[1], loc.coordinates[0]]);
              onLocationSelect(loc);
            }}
            selectedLocation={selectedLocation}
          />
        </MapContainer>
      </div>

      <div className="flex items-center text-sm text-gray-400">
        <FiMapPin className="mr-2" />
        <span>Click on the map to select a location or search above</span>
      </div>
    </div>
  );
};

export default LocationPicker;