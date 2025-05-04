import React, { useState } from 'react';
import { FiEdit2, FiUser, FiAward, FiBarChart2, FiCheckCircle } from 'react-icons/fi';

interface QAProfile {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    role: string;
    experience: string;
    specialization: string;
  };
  certifications: {
    name: string;
    issuer: string;
    date: string;
    status: string;
  }[];
  testingMetrics: {
    totalTestsConducted: number;
    bugsIdentified: number;
    automatedTestsCreated: number;
    testPassRate: number;
  };
  skills: string[];
}

const QAProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<QAProfile>({
    personalInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Senior QA Engineer',
      experience: '5 years',
      specialization: 'Automated Testing'
    },
    certifications: [
      {
        name: 'ISTQB Advanced Level Test Automation Engineer',
        issuer: 'ISTQB',
        date: '2023-05-15',
        status: 'Active'
      },
      {
        name: 'Selenium WebDriver with Java',
        issuer: 'Udemy',
        date: '2022-08-20',
        status: 'Completed'
      }
    ],
    testingMetrics: {
      totalTestsConducted: 1250,
      bugsIdentified: 328,
      automatedTestsCreated: 156,
      testPassRate: 94.5
    },
    skills: [
      'Selenium',
      'Jest',
      'Cypress',
      'API Testing',
      'Performance Testing',
      'Test Planning',
      'Bug Tracking',
      'Test Automation'
    ]
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement save functionality
    console.log('Saving profile:', profile);
  };

  const handleInputChange = (
    section: keyof QAProfile['personalInfo'],
    value: string
  ) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [section]: value
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">QA Engineer Profile</h1>
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? (
            'Save Changes'
          ) : (
            <>
              <FiEdit2 className="mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiUser className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(profile.personalInfo).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(key as keyof QAProfile['personalInfo'], e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testing Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiBarChart2 className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Testing Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(profile.testingMetrics).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-blue-600">
                  {typeof value === 'number' && key.includes('Rate')
                    ? `${value}%`
                    : value}
                </dd>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiAward className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
          </div>
          <div className="space-y-4">
            {profile.certifications.map((cert, index) => (
              <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                <h3 className="text-sm font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-500">
                  {cert.issuer} • {new Date(cert.date).toLocaleDateString()}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiCheckCircle className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Skills & Expertise</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAProfile; 