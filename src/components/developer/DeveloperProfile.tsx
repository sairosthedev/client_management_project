import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContextProvider';
import { FiMail, FiUser, FiBriefcase, FiClock, FiEdit, FiPlus, FiSave, FiX } from 'react-icons/fi';
import { Developer, Technology, PortfolioItem } from '../../types/developer';
import { developerService } from '../../services/developerService';

const DeveloperProfile: React.FC = () => {
  const currentUser = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    experienceYears: 0,
    hourlyRate: 0,
    technologies: [] as Technology[]
  });
  const [newTechnology, setNewTechnology] = useState({
    name: '',
    proficiency: 'intermediate' as 'beginner' | 'intermediate' | 'expert'
  });
  
  // Fetch developer profile on component mount
  useEffect(() => {
    const fetchDeveloperProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!currentUser.id) {
          setError('User ID not found');
          setLoading(false);
          return;
        }
        
        try {
          const profile = await developerService.getCurrentDeveloperProfile(currentUser.id);
          setDeveloper(profile);
          setFormData({
            title: profile.title,
            bio: profile.bio,
            experienceYears: profile.experienceYears,
            hourlyRate: profile.hourlyRate,
            technologies: profile.technologies
          });
        } catch (err: any) {
          console.error('Error fetching developer profile:', err);
          
          // If profile doesn't exist, show creation form
          if (err.response?.status === 404) {
            setIsCreating(true);
          } else {
            // Handle other errors
            setError(`Could not load developer profile: ${err.message}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperProfile();
  }, [currentUser.id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isCreating) {
        // Create new profile
        const newProfile = await developerService.createDeveloperProfile({
          title: formData.title,
          bio: formData.bio,
          experienceYears: formData.experienceYears,
          hourlyRate: formData.hourlyRate,
          technologies: formData.technologies
        });
        
        setDeveloper(newProfile);
        setIsCreating(false);
      } else {
        // Update existing profile
        if (!developer?.id) {
          setError('Developer ID not found');
          return;
        }
        
        const updatedProfile = await developerService.updateDeveloperProfile(
          developer.id,
          {
            title: formData.title,
            bio: formData.bio,
            experienceYears: formData.experienceYears,
            hourlyRate: formData.hourlyRate,
            technologies: formData.technologies
          }
        );
        
        setDeveloper(updatedProfile);
      }
      
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving developer profile:', err);
      setError(err.message || 'Failed to save developer profile');
    } finally {
      setLoading(false);
    }
  };

  // Add new technology to the form
  const handleAddTechnology = () => {
    if (!newTechnology.name.trim()) return;
    
    setFormData({
      ...formData,
      technologies: [
        ...formData.technologies,
        {
          name: newTechnology.name.trim(),
          proficiency: newTechnology.proficiency
        }
      ]
    });
    
    setNewTechnology({
      name: '',
      proficiency: 'intermediate'
    });
  };

  // Remove technology from the form
  const handleRemoveTechnology = (index: number) => {
    const updatedTechnologies = [...formData.technologies];
    updatedTechnologies.splice(index, 1);
    
    setFormData({
      ...formData,
      technologies: updatedTechnologies
    });
  };

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'experienceYears' || name === 'hourlyRate' 
        ? parseInt(value) || 0 
        : value
    });
  };

  // Handle portfolio item operations
  const handleAddPortfolioItem = async (item: PortfolioItem) => {
    if (!developer?.id) return;
    
    try {
      setLoading(true);
      const updatedProfile = await developerService.addPortfolioItem(developer.id, item);
      setDeveloper(updatedProfile);
    } catch (err: any) {
      console.error('Error adding portfolio item:', err);
      setError(err.message || 'Failed to add portfolio item');
    } finally {
      setLoading(false);
    }
  };

  // If loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If error (except for the 'not found' case which triggers creation mode)
  if (error && !isCreating) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // If creating new profile or editing existing profile
  if (isCreating || isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isCreating ? 'Create Developer Profile' : 'Edit Developer Profile'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Professional Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Title*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell clients about your background and expertise..."
              />
            </div>
            
            {/* Years of Experience */}
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience*
              </label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                required
                min="0"
                value={formData.experienceYears}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Hourly Rate */}
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate (USD)*
              </label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                required
                min="0"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies & Skills
              </label>
              
              {/* Display current technologies */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.technologies.map((tech, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tech.name} ({tech.proficiency})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add new technology */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnology.name}
                  onChange={(e) => setNewTechnology({...newTechnology, name: e.target.value})}
                  placeholder="Add a technology..."
                  className="flex-1 p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={newTechnology.proficiency}
                  onChange={(e) => setNewTechnology({
                    ...newTechnology, 
                    proficiency: e.target.value as 'beginner' | 'intermediate' | 'expert'
                  })}
                  className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddTechnology}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FiPlus size={20} />
                </button>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  if (developer) {
                    setFormData({
                      title: developer.title,
                      bio: developer.bio,
                      experienceYears: developer.experienceYears,
                      hourlyRate: developer.hourlyRate,
                      technologies: developer.technologies
                    });
                  }
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>{isCreating ? 'Create Profile' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Display developer profile
  if (developer) {
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-medium text-blue-700">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <p className="text-gray-600">{developer.title}</p>
                <div className="mt-2 flex items-center gap-3 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <FiMail size={14} />
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiBriefcase size={14} />
                    <span>{developer.experienceYears} years experience</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <FiEdit size={14} />
              <span>Edit Profile</span>
            </button>
          </div>
          
          {developer.bio && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">About</h3>
              <p className="text-gray-600">{developer.bio}</p>
            </div>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Hourly Rate</p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-xl font-bold">${developer.hourlyRate}/hr</h3>
              <FiUser className="text-blue-500" size={20} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Availability</p>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold capitalize">{developer.availability}</h3>
                {developer.availability !== 'unavailable' && (
                  <span className="text-sm text-gray-500">({developer.availableHours}h/week)</span>
                )}
              </div>
              <div className={`w-3 h-3 rounded-full ${
                developer.availability === 'available' ? 'bg-green-500' :
                developer.availability === 'partial' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Active Projects</p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-xl font-bold">
                {developer.projects.filter(p => p.status === 'active').length}
              </h3>
              <FiBriefcase className="text-green-500" size={20} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Rating</p>
            <div className="flex items-center justify-between mt-1">
              <h3 className="text-xl font-bold">
                {developer.rating > 0 
                  ? `${developer.rating.toFixed(1)} / 5`
                  : 'Not rated yet'
                }
              </h3>
              <div className="text-yellow-500">★</div>
            </div>
          </div>
        </div>
        
        {/* Skills and Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Skills & Technologies</h3>
            
            <div className="flex flex-wrap gap-2">
              {developer.technologies.map((tech, index) => (
                <div 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    tech.proficiency === 'expert' 
                      ? 'bg-blue-100 text-blue-800' 
                      : tech.proficiency === 'intermediate'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  title={`Proficiency: ${tech.proficiency}`}
                >
                  {tech.name}
                </div>
              ))}
              
              {developer.technologies.length === 0 && (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>
          
          {/* Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Project Assignments</h3>
            
            {developer.projects.length > 0 ? (
              <div className="divide-y">
                {developer.projects.map((project, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{project.role}</h4>
                        <p className="text-sm text-gray-500">
                          {project.hoursPerWeek} hours/week
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No project assignments yet</p>
            )}
          </div>
        </div>
        
        {/* Portfolio */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Portfolio</h3>
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <FiPlus size={14} />
              <span>Add Project</span>
            </button>
          </div>
          
          {developer.portfolio && developer.portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {developer.portfolio.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {item.imageUrl && (
                    <div className="h-40 bg-gray-100">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-sm inline-flex items-center"
                    >
                      View Project <FiBriefcase className="ml-1" size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No portfolio items yet. Add projects to showcase your work.</p>
          )}
        </div>
      </div>
    );
  }
  
  // Fallback for unhandled state
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <h3 className="text-lg font-bold mb-2">Developer Profile Not Found</h3>
      <p className="text-gray-600 mb-4">Please create a developer profile to continue</p>
      <button
        onClick={() => setIsCreating(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Profile
      </button>
    </div>
  );
};

export default DeveloperProfile; 