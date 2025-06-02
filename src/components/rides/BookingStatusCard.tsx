import React from 'react';
import { MapPin, Clock, Phone, Mail, MessageCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Booking } from '../../types';

interface BookingStatusCardProps {
  booking: Booking;
  onStartChat: () => void;
  onStartNavigation: () => void;
  error?: string | null;
}

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({
  booking,
  onStartChat,
  onStartNavigation,
  error
}) => {
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.pickupPoint?.address || booking.ride.departureLocation.address}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Dropoff Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.dropoffPoint?.address || booking.ride.destinationLocation.address}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Pickup Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(new Date(booking.ride.departureTime))}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Arrival</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTime(new Date(booking.ride.estimatedArrivalTime))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {booking.status === 'confirmed' && (
          <>
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.ride.driver.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{booking.ride.driver.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{booking.ride.driver.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <button
                  onClick={onStartChat}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mb-3 sm:mb-0"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message Driver
                </button>
                <button
                  onClick={onStartNavigation}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Open Navigation
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingStatusCard;