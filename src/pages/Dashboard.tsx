import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserRides } from '../hooks/useRides';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { 
  Car, UserCheck, AlertTriangle, CalendarClock, Check, 
  X, Play, CheckCircle, Plus, ArrowRight 
} from 'lucide-react';
import RideCard from '../components/rides/RideCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'driver' | 'passenger'>(user?.isDriver ? 'driver' : 'passenger');
  
  const { 
    rides: driverRides, 
    loading: driverLoading, 
    error: driverError 
  } = useUserRides('driver');
  
  const { 
    rides: passengerRides, 
    loading: passengerLoading, 
    error: passengerError 
  } = useUserRides('passenger');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-primary-100">
            Welcome back, <span className="font-medium">{user?.name}</span>!
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'driver' | 'passenger')}
            >
              {user?.isDriver && <option value="driver">Your Rides as Driver</option>}
              <option value="passenger">Your Bookings as Passenger</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {user?.isDriver && (
                  <button
                    onClick={() => setActiveTab('driver')}
                    className={`${
                      activeTab === 'driver'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Car className="h-5 w-5 mr-2" />
                    Your Rides as Driver
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('passenger')}
                  className={`${
                    activeTab === 'passenger'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  Your Bookings as Passenger
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {activeTab === 'driver' && user?.isDriver && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Your Rides as Driver</h2>
              <Link
                to="/create-ride"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Offer a New Ride
              </Link>
            </div>
            
            {driverLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : driverError ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{driverError}</p>
                  </div>
                </div>
              </div>
            ) : driverRides.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No rides yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first ride.</p>
                <div className="mt-6">
                  <Link
                    to="/create-ride"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="mr-2 -ml-1 h-5 w-5" />
                    Create a Ride
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {driverRides.some(ride => ride.status === 'scheduled' && ride.passengers.some(p => p.status === 'pending')) && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CalendarClock className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Booking requests pending</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>You have pending booking requests that need your confirmation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 bg-gray-50">
                      <h3 className="text-md font-medium text-gray-900">Upcoming & Active Rides</h3>
                    </div>
                    
                    {driverRides.filter(ride => ['scheduled', 'in-progress'].includes(ride.status)).length === 0 ? (
                      <div className="px-6 py-4 text-center text-gray-500">
                        No upcoming rides scheduled.
                      </div>
                    ) : (
                      driverRides
                        .filter(ride => ['scheduled', 'in-progress'].includes(ride.status))
                        .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
                        .map(ride => (
                          <div key={ride._id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <div className={`rounded-full p-1 ${
                                    ride.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {ride.status === 'in-progress' ? (
                                      <Play className="h-4 w-4" />
                                    ) : (
                                      <CalendarClock className="h-4 w-4" />
                                    )}
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {ride.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                                  </span>
                                </div>
                                
                                <div className="mt-2">
                                  <h4 className="text-lg font-medium text-gray-900">
                                    {ride.departureLocation.city} to {ride.destinationLocation.city}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(ride.departureTime)} • ${ride.price} • {ride.availableSeats} seats available
                                  </p>
                                </div>
                                
                                <div className="mt-2">
                                  <span className="text-sm text-gray-700">
                                    Passengers: {ride.passengers.filter(p => p.status === 'confirmed').length}/{ride.availableSeats + ride.passengers.filter(p => p.status === 'confirmed').length}
                                  </span>
                                  
                                  {ride.passengers.some(p => p.status === 'pending') && (
                                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      {ride.passengers.filter(p => p.status === 'pending').length} pending requests
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                                <Link
                                  to={`/rides/${ride._id}`}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  View Details
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 bg-gray-50">
                      <h3 className="text-md font-medium text-gray-900">Past Rides</h3>
                    </div>
                    
                    {driverRides.filter(ride => ['completed', 'cancelled'].includes(ride.status)).length === 0 ? (
                      <div className="px-6 py-4 text-center text-gray-500">
                        No past rides found.
                      </div>
                    ) : (
                      driverRides
                        .filter(ride => ['completed', 'cancelled'].includes(ride.status))
                        .sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime())
                        .map(ride => (
                          <div key={ride._id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <div className={`rounded-full p-1 ${
                                    ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {ride.status === 'completed' ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <X className="h-4 w-4" />
                                    )}
                                  </div>
                                  <span className="ml-2 text-sm font-medium">
                                    {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                                  </span>
                                </div>
                                
                                <div className="mt-2">
                                  <h4 className="text-lg font-medium text-gray-900">
                                    {ride.departureLocation.city} to {ride.destinationLocation.city}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(ride.departureTime)} • ${ride.price}
                                  </p>
                                </div>
                                
                                <div className="mt-2">
                                  <span className="text-sm text-gray-700">
                                    Passengers: {ride.passengers.filter(p => p.status === 'confirmed').length}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                                <Link
                                  to={`/rides/${ride._id}`}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'passenger' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Your Bookings as Passenger</h2>
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Find a Ride
              </Link>
            </div>
            
            {passengerLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : passengerError ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{passengerError}</p>
                  </div>
                </div>
              </div>
            ) : passengerRides.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-1 text-sm text-gray-500">Find and book a ride to get started.</p>
                <div className="mt-6">
                  <Link
                    to="/search"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="mr-2 -ml-1 h-5 w-5" />
                    Find a Ride
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 bg-gray-50">
                      <h3 className="text-md font-medium text-gray-900">Upcoming & Active Bookings</h3>
                    </div>
                    
                    {passengerRides.filter(ride => ['scheduled', 'in-progress'].includes(ride.status)).length === 0 ? (
                      <div className="px-6 py-4 text-center text-gray-500">
                        No upcoming bookings found.
                      </div>
                    ) : (
                      passengerRides
                        .filter(ride => ['scheduled', 'in-progress'].includes(ride.status))
                        .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
                        .map(ride => {
                          const passengerStatus = ride.passengers.find(p => p.user._id === user?._id)?.status;
                          
                          return (
                            <div key={ride._id} className="px-6 py-4 hover:bg-gray-50">
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <div className={`rounded-full p-1 ${
                                      passengerStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      passengerStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {passengerStatus === 'pending' ? (
                                        <CalendarClock className="h-4 w-4" />
                                      ) : passengerStatus === 'confirmed' ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <X className="h-4 w-4" />
                                      )}
                                    </div>
                                    <span className="ml-2 text-sm font-medium">
                                      {passengerStatus === 'pending' ? 'Pending Confirmation' :
                                       passengerStatus === 'confirmed' ? (
                                         ride.status === 'in-progress' ? 'In Progress' : 'Confirmed'
                                       ) : 'Cancelled'}
                                    </span>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <h4 className="text-lg font-medium text-gray-900">
                                      {ride.departureLocation.city} to {ride.destinationLocation.city}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {formatDate(ride.departureTime)} • ${ride.price}
                                    </p>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-700">
                                      Driver: {ride.driver.name}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                                  <Link
                                    to={`/rides/${ride._id}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                  >
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 bg-gray-50">
                      <h3 className="text-md font-medium text-gray-900">Past Bookings</h3>
                    </div>
                    
                    {passengerRides.filter(ride => ['completed', 'cancelled'].includes(ride.status)).length === 0 ? (
                      <div className="px-6 py-4 text-center text-gray-500">
                        No past bookings found.
                      </div>
                    ) : (
                      passengerRides
                        .filter(ride => ['completed', 'cancelled'].includes(ride.status))
                        .sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime())
                        .map(ride => {
                          const passengerStatus = ride.passengers.find(p => p.user._id === user?._id)?.status;
                          
                          return (
                            <div key={ride._id} className="px-6 py-4 hover:bg-gray-50">
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <div className={`rounded-full p-1 ${
                                      ride.status === 'completed' && passengerStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {ride.status === 'completed' && passengerStatus === 'confirmed' ? (
                                        <CheckCircle className="h-4 w-4" />
                                      ) : (
                                        <X className="h-4 w-4" />
                                      )}
                                    </div>
                                    <span className="ml-2 text-sm font-medium">
                                      {ride.status === 'completed' && passengerStatus === 'confirmed' ? 'Completed' : 'Cancelled'}
                                    </span>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <h4 className="text-lg font-medium text-gray-900">
                                      {ride.departureLocation.city} to {ride.destinationLocation.city}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {formatDate(ride.departureTime)} • ${ride.price}
                                    </p>
                                  </div>
                                  
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-700">
                                      Driver: {ride.driver.name}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                                  <Link
                                    to={`/rides/${ride._id}`}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                  >
                                    View Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;