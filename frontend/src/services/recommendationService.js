const API_URL = 'http://localhost:5000/api/recommendations';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getPersonalizedRecommendations = async () => {
  try {
    const response = await fetch(`${API_URL}/personalized`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recommendations');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserPreferences = async (preferences) => {
  try {
    const response = await fetch(`${API_URL}/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update preferences');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Helper function to track user interactions for better recommendations
export const trackEventInteraction = async (eventId, interactionType) => {
  try {
    // This would typically send analytics data to improve recommendations
    const interactions = JSON.parse(localStorage.getItem('eventInteractions') || '[]');
    interactions.push({
      eventId,
      type: interactionType, // 'view', 'like', 'register', 'share'
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    localStorage.setItem('eventInteractions', JSON.stringify(interactions));
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
};