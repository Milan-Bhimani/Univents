const API_URL = 'http://localhost:5000/api/location';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getNearbyEvents = async (latitude, longitude, maxDistance = 25000) => {
  try {
    const response = await fetch(
      `${API_URL}/nearby-events?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
      {
        headers: getAuthHeaders()
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch nearby events');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getRecommendedEvents = async (latitude, longitude) => {
  try {
    const url = latitude && longitude 
      ? `${API_URL}/recommended-events?latitude=${latitude}&longitude=${longitude}`
      : `${API_URL}/recommended-events`;

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recommended events');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserLocation = async (latitude, longitude) => {
  try {
    const response = await fetch(`${API_URL}/update-location`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ longitude, latitude })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update location');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getEventsByArea = async (city, state, radius) => {
  try {
    const params = new URLSearchParams({ city });
    if (state) params.append('state', state);
    if (radius) params.append('radius', radius);

    const response = await fetch(`${API_URL}/events-by-area?${params}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events by area');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};