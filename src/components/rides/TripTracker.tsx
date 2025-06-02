import React from 'react';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Ride } from '../../types';

interface TripTrackerProps {
  ride: Ride;
  currentLocation?: { lat: number; lng: number };
  estimatedTimeToPickup?: number;
  error?: string | null;
}

const TripTracker: React.FC<TripTrackerProps> = ({
  ride,
  currentLocation,
  estimatedTimeToPickup,
  error
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Progress</h3>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-8">
              <div className="relative flex items-center">
                <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-primary-500"></div>
                </div>
                <div className="ml-20">
                  <p className="text-sm font-medium text-gray-900">Current Location</p>
                  {currentLocation ? (
                    <p className="text-sm text-gray-500">
                      {estimatedTimeToPickup ? (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {estimatedTimeToPickup} mins to pickup
                        </span>
                      ) : (
                        'Calculating route...'
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Waiting for location...</p>
                  )}
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                </div>
                <div className="ml-20">
                  <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                  <p className="text-sm text-gray-500">{ride.departureLocation.address}</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                </div>
                <div className="ml-20">
                  <p className="text-sm font-medium text-gray-900">Destination</p>
                  <p className="text-sm text-gray-500">{ride.destinationLocation.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Trip Status</p>
              <p className="text-sm font-medium text-gray-900">
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Arrival</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(ride.estimatedArrivalTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripTracker;