import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiLock } from 'react-icons/fi';

const AccountInfo = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        setUserData(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-800">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-800">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 shadow-lg">
        <div className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-yellow-400 shadow-xl">
              <img
                src={userData.profileImage || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{userData.name}</h2>
            <p className="text-gray-400">{userData.college}</p>
          </div>
          <nav className="space-y-3">
            <button
              onClick={() => navigate('/account/info')}
              className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 rounded-lg transition-all duration-200 flex items-center gap-3 bg-gray-800"
            >
              <FiMail className="w-5 h-5 text-yellow-400" /> Account Info
            </button>
            <button
              onClick={() => navigate('/account/security')}
              className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 rounded-lg transition-all duration-200 flex items-center gap-3"
            >
              <FiLock className="w-5 h-5" /> Security Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="bg-gray-900 rounded-xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-400">Account Information</h1>
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-yellow-400 text-gray-900 rounded-full p-4 shadow-lg hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105"
            >
              <FiEdit2 className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 transform transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="bg-gray-700 p-3 rounded-full">
                    <FiMail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-400">Email Address</span>
                    <span className="block text-lg font-semibold">{userData.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 transform transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="bg-gray-700 p-3 rounded-full">
                    <FiPhone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-400">Phone Number</span>
                    <span className="block text-lg font-semibold">{userData.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 transform transition-all duration-200 hover:shadow-lg">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="bg-gray-700 p-3 rounded-full">
                    <FiMapPin className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-400">College</span>
                    <span className="block text-lg font-semibold">{userData.college}</span>
                  </div>
                </div>
              </div>

              {userData.bio && (
                <div className="bg-gray-800 rounded-lg p-6 transform transition-all duration-200 hover:shadow-lg">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Bio</h3>
                  <p className="text-gray-300 leading-relaxed">{userData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;