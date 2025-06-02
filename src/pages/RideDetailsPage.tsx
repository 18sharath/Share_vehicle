import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRideDetails } from '../hooks/useRides';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, Calendar, Clock, Users, Car, DollarSign, 
  MessageCircle, Star, Phone, Mail, ArrowLeft, AlertTriangle 
} from 'lucide-react';
import RideCard from '../components/rides/RideCard';

const RideDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ride, loading, error } = useRideDetails(id);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const handleBookRide = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!ride) return;
    
    try {
      setBookingStatus('loading');
      setBookingError(null);
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          rideId: ride._id,
          pickupPoint: {
            address: ride.departureLocation.address,
            coordinates: ride.departureLocation.coordinates
          },
          dropoffPoint: {
            address: ride.destinationLocation.address,
            coordinates: ride.destinationLocation.coordinates
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setBookingStatus('success');
      toast.success('Ride booked successfully!');
      
      // Refresh the ride details to update the passenger list
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setBookingStatus('error');
      setBookingError(err.response?.data?.message || 'Failed to book ride');
      toast.error(err.response?.data?.message || 'Failed to book ride');
    }
  };
  
  const isUserDriver = user && ride && user._id === ride.driver._id;
  const isUserPassenger = user && ride && ride.passengers.some(p => p.user._id === user._id);
  const canBookRide = user && ride && !isUserDriver && !isUserPassenger && ride.availableSeats > 0 && ride.status === 'scheduled';
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !ride) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Ride not found'}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-700 focus:ring-white"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white">
              {ride.departureLocation.city} to {ride.destinationLocation.city}
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ride Details</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="rounded-full h-8 w-8 bg-primary-100 flex items-center justify-center">
                        <div className="rounded-full h-3 w-3 bg-primary-500"></div>
                      </div>
                      <div className="h-16 w-0.5 bg-gray-300 my-1"></div>
                      <div className="rounded-full h-8 w-8 bg-primary-100 flex items-center justify-center">
                        <div className="rounded-full h-3 w-3 bg-accent-500"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-6">
                        <div className="flex items-center text-gray-500 mb-1">
                          <MapPin className="h-5 w-5 mr-1" />
                          <span className="text-sm">Pickup Location</span>
                        </div>
                        <p className="font-medium text-lg">{ride.departureLocation.city}</p>
                        <p className="text-gray-700">{ride.departureLocation.address}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-gray-500 mb-1">
                          <MapPin className="h-5 w-5 mr-1" />
                          <span className="text-sm">Dropoff Location</span>
                        </div>
                        <p className="font-medium text-lg">{ride.destinationLocation.city}</p>
                        <p className="text-gray-700">{ride.destinationLocation.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Calendar className="h-5 w-5 mr-1" />
                        <span className="text-sm">Date</span>
                      </div>
                      <p className="font-medium">{formatDate(ride.departureTime)}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Clock className="h-5 w-5 mr-1" />
                        <span className="text-sm">Time</span>
                      </div>
                      <p className="font-medium">
                        {formatTime(ride.departureTime)} - {formatTime(ride.estimatedArrivalTime)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Users className="h-5 w-5 mr-1" />
                        <span className="text-sm">Available Seats</span>
                      </div>
                      <p className="font-medium">{ride.availableSeats} of {ride.availableSeats + ride.passengers.filter(p => p.status === 'confirmed').length}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <DollarSign className="h-5 w-5 mr-1" />
                        <span className="text-sm">Price</span>
                      </div>
                      <p className="font-medium text-primary-600">${ride.price} per passenger</p>
                    </div>
                  </div>
                  
                  {ride.carDetails && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center text-gray-500 mb-3">
                        <Car className="h-5 w-5 mr-1" />
                        <span className="text-sm">Car Details</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="font-medium">{ride.carDetails.make} {ride.carDetails.model}</p>
                        <p className="text-gray-700">Color: {ride.carDetails.color}</p>
                        {ride.carDetails.licensePlate && (
                          <p className="text-gray-700">License Plate: {ride.carDetails.licensePlate}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {ride.description && (
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center text-gray-500 mb-3">
                        <MessageCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm">Trip Notes</span>
                      </div>
                      <p className="text-gray-700">{ride.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {ride.status !== 'scheduled' && (
              <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Ride Status</h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    ride.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {ride.status === 'in-progress' ? 'In Progress' :
                     ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Driver Information</h2>
                
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {ride.driver.profilePicture ? (
                      <img 
                        src={ride.driver.profilePicture} 
                        alt={ride.driver.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-700 font-bold text-2xl">
                        {ride.driver.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <p className="font-medium text-lg">{ride.driver.name}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {ride.driver.rating ? `${ride.driver.rating.toFixed(1)} rating` : 'New driver'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isUserPassenger && ride.passengers.some(p => p.user._id === user?._id && p.status === 'confirmed') && (
                  <div className="mt-4 space-y-3">
                    {ride.driver.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-5 w-5 text-primary-500 mr-2" />
                        <span>{ride.driver.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-5 w-5 text-primary-500 mr-2" />
                      <span>{ride.driver.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {isUserPassenger ? 'Your Booking Status' : 'Book This Ride'}
                </h2>
                
                {isUserDriver ? (
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-yellow-800">This is your ride posting.</p>
                  </div>
                ) : isUserPassenger ? (
                  <div>
                    {ride.passengers.map(passenger => {
                      if (passenger.user._id === user?._id) {
                        return (
                          <div 
                            key={passenger.user._id} 
                            className={`p-4 rounded-md ${
                              passenger.status === 'confirmed' ? 'bg-green-50' :
                              passenger.status === 'cancelled' ? 'bg-red-50' : 'bg-yellow-50'
                            }`}
                          >
                            <p className={
                              passenger.status === 'confirmed' ? 'text-green-800' :
                              passenger.status === 'cancelled' ? 'text-red-800' : 'text-yellow-800'
                            }>
                              {passenger.status === 'confirmed' ? 'Your booking is confirmed!' :
                              passenger.status === 'cancelled' ? 'Your booking was cancelled.' : 'Your booking is pending confirmation.'}
                            </p>
                            {passenger.status === 'pending' && (
                              <p className="text-sm text-gray-600 mt-2">
                                The driver will review your booking request and confirm it soon.
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <div>
                    {ride.status !== 'scheduled' ? (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">This ride is no longer available for booking.</p>
                      </div>
                    ) : ride.availableSeats === 0 ? (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">This ride is fully booked.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-4">
                          Book your spot now for ${ride.price}. Once the driver accepts your booking, you'll pay in cash directly to the driver.
                        </p>
                        
                        {bookingError && (
                          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-red-700">{bookingError}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={handleBookRide}
                          disabled={bookingStatus === 'loading' || !canBookRide}
                          className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            canBookRide ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                        >
                          {bookingStatus === 'loading' ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : !user ? (
                            'Login to Book Ride'
                          ) : (
                            'Book This Ride'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetailsPage;