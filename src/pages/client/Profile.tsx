import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiAlertCircle } from 'react-icons/fi';
import { clientService } from '../../services/clientService';
import { ClientType } from '../../types';
import { useClientAuth } from '../../contexts/ClientAuthContext';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

const Profile: React.FC = () => {
  const { client, isAuthenticated } = useClientAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: 'Client',
    address: '',
    city: '',
    country: '',
    timezone: 'America/Los_Angeles',
    preferredLanguage: 'English',
    notificationPreferences: {
      email: true,
      sms: true,
      inApp: true,
    },
  });

  useEffect(() => {
    // Initialize profile with client data from context if available
    if (client) {
      setProfile(prev => ({
        ...prev,
        name: client.name || '',
        email: client.email || '',
        phone: client.contactNumber || '',
        company: client.company || '',
      }));
    } else if (isAuthenticated) {
      // Fetch profile only if not already loaded but authenticated
      fetchProfile();
    }
  }, [client, isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await clientService.getProfile();
      
      // Update profile state with client data
      setProfile(prev => ({
        ...prev,
        name: data.name || '',
        email: data.email || '',
        phone: data.contactNumber || '',
        company: data.company || '',
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!client) return;
    
    try {
      setIsLoading(true);
      
      // Update client profile
      const updatedData = await clientService.updateProfile({
        name: profile.name,
        email: profile.email,
        company: profile.company,
        contactNumber: profile.phone,
      });
      
      // Update profile with the returned data
      setProfile(prev => ({
        ...prev,
        name: updatedData.name || '',
        email: updatedData.email || '',
        phone: updatedData.contactNumber || '',
        company: updatedData.company || '',
      }));
      
      setError(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationPreferenceChange = (type: keyof typeof profile.notificationPreferences) => {
    setProfile(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type],
      },
    }));
  };

  if (isLoading && !profile.name) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : isEditing ? (
            <>
              <FiSave className="w-5 h-5 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <FiEdit2 className="w-5 h-5 mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                value={profile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={profile.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language
              </label>
              <select
                value={profile.preferredLanguage}
                onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                disabled={!isEditing || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={profile.notificationPreferences.email}
                onChange={() => handleNotificationPreferenceChange('email')}
                disabled={!isEditing || isLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={profile.notificationPreferences.sms}
                onChange={() => handleNotificationPreferenceChange('sms')}
                disabled={!isEditing || isLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inAppNotifications"
                checked={profile.notificationPreferences.inApp}
                onChange={() => handleNotificationPreferenceChange('inApp')}
                disabled={!isEditing || isLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="inAppNotifications" className="ml-2 block text-sm text-gray-700">
                In-App Notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 