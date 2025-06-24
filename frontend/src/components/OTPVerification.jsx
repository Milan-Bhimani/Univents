import { useState } from 'react';

const OTPVerification = ({ email, onVerificationComplete }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setError('');
    let timeoutId;
    try {
      // Set a timeout to handle slow responses
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Request timed out. Please try again.'));
        }, 30000); // 30 second timeout
      });

      const fetchPromise = fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      const data = await response.json();
      if (data.success) {
        onVerificationComplete();
      } else {
        setRemainingAttempts(prev => prev - 1);
        setError(`Invalid OTP. ${remainingAttempts - 1} attempts remaining.`);
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (error.message === 'Request timed out. Please try again.') {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p className="mb-4">Please enter the OTP sent to {email}</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Enter OTP"
          maxLength={6}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || remainingAttempts === 0}
          className={`w-full py-2 rounded-lg ${isLoading || remainingAttempts === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isLoading ? 'Verifying...' : remainingAttempts === 0 ? 'No attempts left' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;