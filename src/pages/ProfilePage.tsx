import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Phone, Pencil, Car, CheckCircle, 
  Save, X, AlertTriangle, Star 
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggleDriverLoading, setToggleDriverLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setEditing(false);
      toast.success('Profile updated successfully!');
      
      // Refresh page to update user data
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating profile');
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setEditing(false);
    
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
    
    setError(null);
  };
  
  const handleToggleDriver = async () => {
    try {
      setToggleDriverLoading(true);
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/toggle-driver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success(user?.isDriver ? 'Driver mode disabled' : 'Driver mode enabled');
      
      // Refresh page to update user data
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error updating driver status');
    } finally {
      setToggleDriverLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    // Redirect to login if not authenticated
    navigate('/login');
    return null;
  }
  
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
            
            {editing ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Your phone number"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Only shared with confirmed ride partners.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    About You
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Tell others a bit about yourself..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
                    {user.name.charAt(0)}
                  </div>
                  
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">{user.phone}</span>
                      </div>
                    )}
                    
                    {user.rating && user.rating > 0 && (
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-700">{user.rating.toFixed(1)} rating</span>
                        {user.totalRides && user.totalRides > 0 && (
                          <span className="text-sm text-gray-500 ml-2">({user.totalRides} rides)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {user.bio && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">About</h4>
                    <p className="mt-1 text-sm text-gray-500">{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium text-gray-900 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-primary-500" />
                    Driver Mode
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.isDriver ? 
                      'You can create and manage rides as a driver.' : 
                      'Enable to start offering rides as a driver.'}
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleToggleDriver}
                    disabled={toggleDriverLoading}
                    className={`relative inline-flex items-center py-2 px-4 rounded-md text-sm font-medium ${
                      user.isDriver ?
                        'text-red-700 bg-red-100 hover:bg-red-200' :
                        'text-green-700 bg-green-100 hover:bg-green-200'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  >
                    {toggleDriverLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                    ) : user.isDriver ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Disable Driver Mode
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Enable Driver Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;