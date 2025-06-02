import React from 'react';
import { MapPin, Clock, User, Check, X, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Booking } from '../../types';

interface BookingRequestCardProps {
  booking: Booking;
  onAccept: (bookingId: string) => void;
  onCancel: (bookingId: string) => void;
  loading?: boolean;
  error?: string | null;
}

const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  booking,
  onAccept,
  onCancel,
  loading,
  error
}) => {
  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
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

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            {booking.passenger.profilePicture ? (
              <img
                src={booking.passenger.profilePicture}
                alt={booking.passenger.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-primary-600" />
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{booking.passenger.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending
            </span>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.pickupPoint?.address || booking.ride.departureLocation.address}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Dropoff Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {booking.dropoffPoint?.address || booking.ride.destinationLocation.address}
                </p>
              </div>
            </div>

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

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => onCancel(booking._id)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </button>
            <button
              onClick={() => onAccept(booking._id)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingRequestCard;