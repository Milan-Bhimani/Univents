const API_URL = 'http://localhost:5000/api/events';

export const getAllEvents = async (category = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = category
      ? `${API_URL}?category=${category}`
      : `${API_URL}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};