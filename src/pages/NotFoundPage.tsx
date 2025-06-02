import React from 'react';
import { Link } from 'react-router-dom';
import { ZapOff as MapOff } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <MapOff className="mx-auto h-16 w-16 text-primary-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Lost on your journey?</h2>
          <p className="mt-2 text-sm text-gray-600">
            We can't seem to find the page you're looking for.
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to="/"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Home
            </Link>
            <Link
              to="/search"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Find a Ride
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;