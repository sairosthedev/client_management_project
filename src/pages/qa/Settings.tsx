import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { FiSave } from 'react-icons/fi';

interface QASettings {
  automaticTestingEnabled: boolean;
  notificationsEnabled: boolean;
  coverageThreshold: number;
  maxBugSeverity: string;
  testEnvironment: string;
  autoGenerateReports: boolean;
}

const QASettings: React.FC = () => {
  const [settings, setSettings] = useState<QASettings>({
    automaticTestingEnabled: true,
    notificationsEnabled: true,
    coverageThreshold: 80,
    maxBugSeverity: 'high',
    testEnvironment: 'staging',
    autoGenerateReports: false,
  });

  const handleSettingChange = (key: keyof QASettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">QA Testing Settings</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Automatic Testing Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Automatic Testing</h3>
                <p className="text-sm text-gray-500">Enable automated testing on code commits</p>
              </div>
              <Switch
                checked={settings.automaticTestingEnabled}
                onChange={(checked: boolean) => handleSettingChange('automaticTestingEnabled', checked)}
                className={`${
                  settings.automaticTestingEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
              >
                <span className={`${
                  settings.automaticTestingEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>

            {/* Coverage Threshold */}
            <div>
              <label htmlFor="coverage" className="block text-sm font-medium text-gray-700">
                Coverage Threshold (%)
              </label>
              <input
                type="number"
                id="coverage"
                min="0"
                max="100"
                value={settings.coverageThreshold}
                onChange={(e) => handleSettingChange('coverageThreshold', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Bug Severity */}
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                Maximum Bug Severity
              </label>
              <select
                id="severity"
                value={settings.maxBugSeverity}
                onChange={(e) => handleSettingChange('maxBugSeverity', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Test Environment */}
            <div>
              <label htmlFor="environment" className="block text-sm font-medium text-gray-700">
                Test Environment
              </label>
              <select
                id="environment"
                value={settings.testEnvironment}
                onChange={(e) => handleSettingChange('testEnvironment', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Test Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications for test results</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onChange={(checked: boolean) => handleSettingChange('notificationsEnabled', checked)}
                className={`${
                  settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
              >
                <span className={`${
                  settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>

            {/* Auto Generate Reports Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Auto Generate Reports</h3>
                <p className="text-sm text-gray-500">Automatically generate reports after test completion</p>
              </div>
              <Switch
                checked={settings.autoGenerateReports}
                onChange={(checked: boolean) => handleSettingChange('autoGenerateReports', checked)}
                className={`${
                  settings.autoGenerateReports ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
              >
                <span className={`${
                  settings.autoGenerateReports ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QASettings; 