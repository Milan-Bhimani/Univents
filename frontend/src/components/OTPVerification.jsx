import { useState } from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';

const OTPVerification = ({ email, onVerificationComplete }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
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
        setSuccess('Email verified successfully!');
        setTimeout(() => onVerificationComplete(), 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-4">
            <FaShieldAlt className="text-3xl text-yellow-400" />
          </div>
          <h1 className="text-3xl font-black text-yellow-400 mb-2 drop-shadow-lg tracking-wide">
            Email Verification
          </h1>
          <p className="text-gray-400 text-lg">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 shadow-2xl">
          <div className="text-center mb-6">
            <p className="text-gray-300 text-base">
              We've sent a 6-digit code to
            </p>
            <p className="text-yellow-400 font-semibold text-lg">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-yellow-400/90 font-semibold text-sm">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 px-4 py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {/* Attempts Counter */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <FaClock className="text-yellow-400" />
              <span>
                {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                <FaExclamationTriangle />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
                <FaCheckCircle />
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || remainingAttempts === 0}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Verifying...' : remainingAttempts === 0 ? 'No attempts left' : 'Verify Email'}
            </button>
          </form>

          {/* Help Text */}
          <div className="text-center pt-6">
            <p className="text-gray-400 text-sm">
              Didn't receive the code? Check your spam folder or
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 text-sm font-medium"
            >
              try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;