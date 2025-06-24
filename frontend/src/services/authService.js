const API_URL = 'http://localhost:5000/api/auth';

const validateToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return response.ok && data.success;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const login = async (email, password) => {
  try {
    console.log('Attempting login for:', email);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Non-JSON response received:', responseText);
      throw new Error('Server returned invalid response format. Please try again.');
    }

    const data = await response.json();
    console.log('Raw server response:', response);
    console.log('Parsed response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Handle different response formats
    if (data.success) {
      // Case 1: Response with data object containing token
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        return data;
      }
      // Case 2: Response indicating successful credentials verification
      if (data.message && data.message.includes('proceed with OTP verification')) {
        return data;
      }
      // Case 3: Direct token in response
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      }
    }
    
    console.error('Unexpected response structure:', data);
    throw new Error(data.message || 'Invalid response format from server');
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

export const signup = async (name, email, password) => {
  try {
    console.log('Attempting signup for:', email);
    
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    console.log('Raw signup response:', response);
    console.log('Parsed signup data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    // Match the same structure as login
    if (data.success && data.data && data.data.token) {
      localStorage.setItem('token', data.data.token);
      if (data.data.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      return data;
    } else {
      console.error('Unexpected signup response structure:', data);
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Signup service error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const requireAuth = (to, from, next) => {
  if (!isAuthenticated()) {
    return '/login';
  }
  return next();
};