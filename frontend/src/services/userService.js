const API_URL = 'http://localhost:5000/api/users';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Update the stored user data
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  } catch (error) {
    throw error;
  }
};

export const changeEmail = async (currentEmail, newEmail) => {
  try {
    const response = await fetch(`${API_URL}/change-email`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentEmail, newEmail })
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error('Server response was not in JSON format');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Email update failed. Please try again.');
    }

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    // Check if user data exists and is valid
    if (!data.data?.user?.email) {
      throw new Error('Email update failed - invalid user data received');
    }

    // Update local storage only if we have valid user data
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data;
  } catch (error) {
    console.error('Change email error:', error);
    throw new Error(error.message || 'Failed to update email. Please try again later.');
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json().catch(() => {
      throw new Error('Invalid JSON response from server');
    });

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update password');
    }

    if (!data.success) {
      throw new Error('Invalid response format from server');
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
};