import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import { updateProfile, changePassword } from '../../api/authApi';
import { useToast } from '../../context/ToastContext'; // Adjust path as needed

const Profile = () => {
  const { user, token, refreshProfile, loading } = useAuth();
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [passwords, setPasswords] = useState({ oldPwd: '', newPwd: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await updateProfile(token!, {
        fullName,
        email,
        username,
      });
      addToast(res.message || 'Profile updated successfully!', 'success');
      await refreshProfile();
      setIsEditing(false);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await changePassword(token!, passwords.oldPwd, passwords.newPwd);
      addToast(res.message || 'Password changed successfully!', 'success');
      setPasswords({ oldPwd: '', newPwd: '' });
      setIsChangingPassword(false);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Password change failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setUsername(user.username);
    }
    setIsEditing(false);
  };

  const handleCancelPasswordChange = () => {
    setPasswords({ oldPwd: '', newPwd: '' });
    setIsChangingPassword(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <p className="text-red-800 text-center">No user data found. Please try logging in again.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
          <p className="mt-2 text-gray-600">Manage your account information and security</p>
        </div>

        <div className="space-y-6">
          {/* Profile Information Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFullName(e.target.value)
                    }

                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                       setUsername(e.target.value)
                     }

                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }

                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Security</h3>
                {!isChangingPassword && (
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="oldPassword"
                      type="password"
                      value={passwords.oldPwd}
                      onChange={(e) => setPasswords({ ...passwords, oldPwd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwords.newPwd}
                      onChange={(e) => setPasswords({ ...passwords, newPwd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;