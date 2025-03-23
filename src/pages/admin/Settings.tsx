import React, { useState } from 'react';
import { FiSave, FiUser, FiMail, FiLock, FiBell, FiGlobe, FiShield } from 'react-icons/fi';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const SettingsSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-600">{icon}</span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const SettingsPage: React.FC = () => {
  const [profileSettings, setProfileSettings] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    timezone: 'UTC-5',
    language: 'English',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      enabled: true,
    },
    {
      id: '2',
      title: 'Project Updates',
      description: 'Get notified when projects are created or updated',
      enabled: true,
    },
    {
      id: '3',
      title: 'Task Assignments',
      description: 'Receive notifications for new task assignments',
      enabled: false,
    },
  ]);

  const handleNotificationToggle = (id: string) => {
    setNotificationSettings(settings =>
      settings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SettingsSection title="Profile Settings" icon={<FiUser />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileSettings.name}
                onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Notification Preferences" icon={<FiBell />}>
          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    onChange={() => handleNotificationToggle(setting.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection title="Regional Settings" icon={<FiGlobe />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select
                value={profileSettings.timezone}
                onChange={(e) => setProfileSettings({ ...profileSettings, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC">UTC</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={profileSettings.language}
                onChange={(e) => setProfileSettings({ ...profileSettings, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Security Settings" icon={<FiShield />}>
          <div className="space-y-4">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Change Password
            </button>
            <div>
              <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mb-2">
                Add an extra layer of security to your account
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Enable 2FA
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsPage; 