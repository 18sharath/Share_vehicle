import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MapPin, Clock, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Ride } from '../../types';

interface RideCardProps {
  ride: Ride;
  showDetailedView?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ ride, showDetailedView = false }) => {
  const departureTime = new Date(ride.departureTime);
  const estimatedArrivalTime = new Date(ride.estimatedArrivalTime);
  
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'EEE, MMM d');
  };
  
  const getDepartureTimeString = () => {
    const now = new Date();
    if (departureTime > now) {
      return `Departs ${formatDistanceToNow(departureTime, { addSuffix: true })}`;
    } else {
      return `Departed ${formatDistanceToNow(departureTime, { addSuffix: true })}`;
    }
  };
  
  const getTripDuration = () => {
    const durationMs = estimatedArrivalTime.getTime() - departureTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.round((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${durationHours}h ${durationMinutes}m`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full h-10 w-10 bg-primary-100 flex items-center justify-center overflow-hidden">
            {ride.driver.profilePicture ? (
              <img 
                src={ride.driver.profilePicture} 
                alt={ride.driver.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-primary-700 font-semibold text-lg">
                {ride.driver.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{ride.driver.name}</p>
            <div className="flex items-center">
              <span className="text-xs text-yellow-500">★</span>
              <span className="text-xs text-gray-500 ml-1">
                {ride.driver.rating ? ride.driver.rating.toFixed(1) : 'New driver'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600">${ride.price}</p>
          <p className="text-xs text-gray-500">per passenger</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="rounded-full h-6 w-6 bg-primary-100 flex items-center justify-center">
                <div className="rounded-full h-2 w-2 bg-primary-500"></div>
              </div>
              <div className="h-14 w-0.5 bg-gray-300 my-1"></div>
              <div className="rounded-full h-6 w-6 bg-primary-100 flex items-center justify-center">
                <div className="rounded-full h-2 w-2 bg-accent-500"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="mb-4">
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{ride.departureLocation.city}</p>
                <p className="text-sm text-gray-500">{ride.departureLocation.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{ride.destinationLocation.city}</p>
                <p className="text-sm text-gray-500">{ride.destinationLocation.address}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center text-gray-500 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-xs">{formatDate(departureTime)}</span>
                </div>
                <p className="font-medium">{formatTime(departureTime)} - {formatTime(estimatedArrivalTime)}</p>
                <p className="text-sm text-gray-500">{getTripDuration()} duration</p>
              </div>
              
              <div>
                <div className="flex items-center text-gray-500 mb-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-xs">Available Seats</span>
                </div>
                <p className="font-medium">{ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} left</p>
                <p className="text-sm text-gray-500">{getDepartureTimeString()}</p>
              </div>
            </div>
          </div>
          
          {showDetailedView && ride.description && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-1">Trip Notes</p>
              <p className="text-sm">{ride.description}</p>
            </div>
          )}
          
          {ride.carDetails && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-1">Car Details</p>
              <p className="text-sm">
                {ride.carDetails.make} {ride.carDetails.model}, {ride.carDetails.color}
                {ride.carDetails.licensePlate && ` (${ride.carDetails.licensePlate})`}
              </p>
            </div>
          )}
        </div>
        
        {!showDetailedView && (
          <div className="mt-4">
            <Link
              to={`/rides/${ride._id}`}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideCard;