import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const navigate = useNavigate();

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!token || !user) {
        navigate('/login');
        return;
      }

      if (emailData.newEmail !== emailData.confirmEmail) {
        setError('New email and confirm email do not match');
        return;
      }

      if (!otpSent) {
        await generateOTP(emailData.newEmail);
        setOtpSent(true);
        setShowOTPInput(true);
        setSuccess('OTP has been sent to your new email address');
        setIsLoading(false);
        return;
      }

      if (!otpVerified) {
        try {
          await verifyOTP(emailData.newEmail, otp);
          setOtpVerified(true);
          setSuccess('OTP verified successfully! Updating email...');
          
          const data = await changeEmail(emailData.currentEmail, emailData.newEmail, true);
          if (data.success) {
            setSuccess('Email updated successfully!');
            setTimeout(() => {
              localStorage.removeItem('token');
              navigate('/login');
            }, 2000);
          } else {
            setError('Failed to update email');
            setOtpVerified(false);
            setOtpSent(false);
            setShowOTPInput(false);
          }
        } catch (error) {
          setError(error.message);
          setOtpVerified(false);
          setOtpSent(false);
          setShowOTPInput(false);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (!otpSent) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        await generateOTP(currentUser.email);
        setOtpSent(true);
        setShowOTPInput(true);
        setSuccess('OTP has been sent to your email address');
        setIsLoading(false);
        return;
      }

      if (!otpVerified) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        await verifyOTP(currentUser.email, otp);
        setOtpVerified(true);
        setSuccess('OTP verified successfully! Updating password...');
      }

      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      let data;
      try {
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network and try again.');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server. Please try again later.');
        }

        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Response parsing error:', jsonError);
          throw new Error('Unable to process server response. Please check your connection and try again.');
        }
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to the server. Please check your connection and try again.');
        }
        throw error;
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || 'Failed to update password';
        throw new Error(errorMessage);
      }

      setSuccess('Password updated successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8"> 
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h2>
        <hr className="border-t-2 border-gray-200 mb-8" />
        <p className="text-gray-600 text-center">Account settings functionality has been removed.</p>

        <div className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-500 text-sm mt-2"
            >
              {success}
            </motion.div>
          )}

          {activeTab === 'email' ? (
            <form onSubmit={handleEmailChange} className="space-y-8">
              {showOTPInput && (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
                  <label className="w-full sm:w-1/4 text-gray-700 font-semibold">Enter OTP</label>
                  <div className="w-full sm:w-1/2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C3D4F] focus:border-transparent transition-all bg-white text-gray-900"
                      placeholder="Enter OTP sent to your email"
                      required={showOTPInput}
                    />
                  </div>
                </div>
              )}
              {[
                { label: "Current Email", name: "currentEmail", type: "email", value: emailData.currentEmail },
                { label: "New Email", name: "newEmail", type: "email", value: emailData.newEmail },
                { label: "Confirm Email", name: "confirmEmail", type: "email", value: emailData.confirmEmail },
              ].map((field, index) => (
                <div key={index} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
                  <label className="w-full sm:w-1/4 text-gray-700 font-semibold">{field.label}</label>
                  <div className="w-full sm:w-1/2">
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.value}
                      onChange={(e) => setEmailData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C3D4F] focus:border-transparent transition-all bg-white text-gray-900"
                      placeholder={field.label}
                      required
                    />
                    {field.name === 'confirmEmail' && emailData.confirmEmail && emailData.confirmEmail !== emailData.newEmail && (
                      <p className="text-red-500 text-sm mt-1">Emails do not match</p>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-[#2C3D4F] text-white px-6 py-2.5 rounded-lg mt-6 hover:bg-[#263545] transition-colors shadow-md flex items-center justify-center min-w-[150px] ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : 'Save My Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-8">
              {showOTPInput && (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
                  <label className="w-full sm:w-1/4 text-gray-700 font-semibold">Enter OTP</label>
                  <div className="w-full sm:w-1/2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C3D4F] focus:border-transparent transition-all bg-white text-gray-900"
                      placeholder="Enter OTP sent to your email"
                      required={showOTPInput}
                    />
                  </div>
                </div>
              )}
              {[
                { label: "Current Password", name: "currentPassword", type: "password", value: passwordData.currentPassword },
                { label: "New Password", name: "newPassword", type: "password", value: passwordData.newPassword },
                { label: "Confirm Password", name: "confirmPassword", type: "password", value: passwordData.confirmPassword },
              ].map((field, index) => (
                <div key={index} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
                  <label className="w-full sm:w-1/4 text-gray-700 font-semibold">{field.label}</label>
                  <div className="w-full sm:w-1/2 relative">
                    <input
                      type={showPasswords[field.name] ? 'text' : 'password'}
                      name={field.name}
                      value={field.value}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2C3D4F] focus:border-transparent transition-all bg-white text-gray-900 pr-10"
                      placeholder={field.label}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPasswords[field.name] ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-[#2C3D4F] text-white px-6 py-2.5 rounded-lg mt-6 hover:bg-[#263545] transition-colors shadow-md flex items-center justify-center min-w-[150px] ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : 'Save My Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}