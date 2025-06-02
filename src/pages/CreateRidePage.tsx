import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, Calendar, Clock, Users, Car, DollarSign, 
  Save, AlertTriangle, Info 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreateRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    departureCityFrom: '',
    departureAddressFrom: '',
    departureCityTo: '',
    departureAddressTo: '',
    departureDate: '',
    departureTime: '',
    estimatedArrivalDate: '',
    estimatedArrivalTime: '',
    price: '',
    availableSeats: '3',
    description: '',
    carMake: '',
    carModel: '',
    carColor: '',
    carLicensePlate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update estimated arrival date based on departure date if it's empty
    if (name === 'departureDate' && !formData.estimatedArrivalDate) {
      setFormData(prev => ({ ...prev, estimatedArrivalDate: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!formData.departureCityFrom || !formData.departureCityTo || !formData.departureDate || 
          !formData.departureTime || !formData.estimatedArrivalDate || !formData.estimatedArrivalTime ||
          !formData.price || !formData.availableSeats) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      // Format departure and arrival times
      const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`);
      const arrivalDateTime = new Date(`${formData.estimatedArrivalDate}T${formData.estimatedArrivalTime}`);
      
      // Validate times
      if (departureDateTime >= arrivalDateTime) {
        setError('Estimated arrival time must be after departure time');
        setLoading(false);
        return;
      }
      
      // Put together ride data
      const rideData = {
        departureLocation: {
          city: formData.departureCityFrom,
          address: formData.departureAddressFrom,
          coordinates: {
            lat: 0, // In a real app, we would use geocoding API
            lng: 0
          }
        },
        destinationLocation: {
          city: formData.departureCityTo,
          address: formData.departureAddressTo,
          coordinates: {
            lat: 0, // In a real app, we would use geocoding API
            lng: 0
          }
        },
        departureTime: departureDateTime.toISOString(),
        estimatedArrivalTime: arrivalDateTime.toISOString(),
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats),
        description: formData.description || undefined,
        carDetails: {
          make: formData.carMake || undefined,
          model: formData.carModel || undefined,
          color: formData.carColor || undefined,
          licensePlate: formData.carLicensePlate || undefined
        }
      };
      
      // Create the ride
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rides`,
        rideData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Ride created successfully!');
      navigate(`/rides/${response.data._id}`);
    } catch (err: any) {
      console.error('Error creating ride:', err);
      setError(err.response?.data?.message || 'Failed to create ride');
      toast.error(err.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user is a driver
  if (user && !user.isDriver) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Become a driver first</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You need to enable driver mode in your profile before you can offer rides.</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Go to profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Offer a Ride</h1>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ride Details</h2>
            
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-1 text-primary-500" />
                  Route Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="departureCityFrom" className="block text-sm font-medium text-gray-700 mb-1">
                      From City *
                    </label>
                    <input
                      type="text"
                      id="departureCityFrom"
                      name="departureCityFrom"
                      value={formData.departureCityFrom}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="City of departure"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="departureAddressFrom" className="block text-sm font-medium text-gray-700 mb-1">
                      From Address
                    </label>
                    <input
                      type="text"
                      id="departureAddressFrom"
                      name="departureAddressFrom"
                      value={formData.departureAddressFrom}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Specific address or meeting point"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="departureCityTo" className="block text-sm font-medium text-gray-700 mb-1">
                      To City *
                    </label>
                    <input
                      type="text"
                      id="departureCityTo"
                      name="departureCityTo"
                      value={formData.departureCityTo}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Destination city"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="departureAddressTo" className="block text-sm font-medium text-gray-700 mb-1">
                      To Address
                    </label>
                    <input
                      type="text"
                      id="departureAddressTo"
                      name="departureAddressTo"
                      value={formData.departureAddressTo}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Specific address or dropoff point"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-1 text-primary-500" />
                  Departure & Arrival
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      id="departureDate"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time *
                    </label>
                    <input
                      type="time"
                      id="departureTime"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="estimatedArrivalDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Arrival Date *
                    </label>
                    <input
                      type="date"
                      id="estimatedArrivalDate"
                      name="estimatedArrivalDate"
                      value={formData.estimatedArrivalDate}
                      onChange={handleChange}
                      required
                      min={formData.departureDate || new Date().toISOString().split('T')[0]}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="estimatedArrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Arrival Time *
                    </label>
                    <input
                      type="time"
                      id="estimatedArrivalTime"
                      name="estimatedArrivalTime"
                      value={formData.estimatedArrivalTime}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1 text-primary-500" />
                  Price & Seats
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Passenger ($) *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        required
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="15.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-1">
                      Available Seats *
                    </label>
                    <select
                      id="availableSeats"
                      name="availableSeats"
                      value={formData.availableSeats}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="1">1 seat</option>
                      <option value="2">2 seats</option>
                      <option value="3">3 seats</option>
                      <option value="4">4 seats</option>
                      <option value="5">5 seats</option>
                      <option value="6">6 seats</option>
                      <option value="7">7 seats</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                  <Car className="h-5 w-5 mr-1 text-primary-500" />
                  Car Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="carMake" className="block text-sm font-medium text-gray-700 mb-1">
                      Car Make
                    </label>
                    <input
                      type="text"
                      id="carMake"
                      name="carMake"
                      value={formData.carMake}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Toyota, Honda, etc."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
                      Car Model
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Camry, Civic, etc."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="carColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Car Color
                    </label>
                    <input
                      type="text"
                      id="carColor"
                      name="carColor"
                      value={formData.carColor}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Red, Blue, Silver, etc."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="carLicensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                      License Plate (optional)
                    </label>
                    <input
                      type="text"
                      id="carLicensePlate"
                      name="carLicensePlate"
                      value={formData.carLicensePlate}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="ABC123"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Provide additional details about your ride, luggage space, rules, etc."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Create Ride
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRidePage;