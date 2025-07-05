const API_URL = 'http://localhost:5000/api';

// Generate OTP for a given email
export const generateOTP = async (email) => {
  try {
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email format');
    }

    const response = await fetch(`${API_URL}/otp/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned invalid response format');
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OTP generation error:', error);
    throw error;
  }
};

// Verify OTP for a given email
export const verifyOTP = async (email, otp) => {
  try {
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Invalid email format');
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      throw new Error('Invalid OTP format - must be 6 digits');
    }

    const response = await fetch(`${API_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    });

    if (response.status === 429) {
      const text = await response.text();
      throw new Error(text || 'Too many attempts. Please wait before trying again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    if (!data.success) {
      console.error('Invalid response format:', data);
      throw new Error('Authentication failed - invalid response format');
    }

    // Validate and extract token from response
    let token = null;
    let userData = null;

    // Handle different response formats
    if (data.data && data.data.token) {
      token = data.data.token;
      userData = data.data.user;
    } else if (data.token) {
      token = data.token;
      userData = data.user;
    } else {
      console.error('Token not found in response:', data);
      throw new Error('Token not found in response');
    }

    // Validate token format
    if (!token || typeof token !== 'string') {
      console.error('Invalid token format in response:', data);
      throw new Error('Invalid token format received');
    }

    // Return structured response with consistent format
    return {
      success: true,
      data: {
        token,
        user: userData
      }
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};