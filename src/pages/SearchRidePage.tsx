import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, DollarSign, Users, Clock, SortAsc, SortDesc } from 'lucide-react';
import { useRides } from '../hooks/useRides';
import { RideFilter } from '../types';
import RideCard from '../components/rides/RideCard';

const SearchRidePage: React.FC = () => {
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [availableSeats, setAvailableSeats] = useState<number | undefined>(1);
  const [sortBy, setSortBy] = useState<'price' | 'departureTime'>('departureTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState<RideFilter>({
    availableSeats: 1,
    sortBy: 'departureTime',
    sortOrder: 'asc'
  });
  
  const { rides, loading, error } = useRides(activeFilter);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFilter: RideFilter = {
      departureCity: departureCity || undefined,
      destinationCity: destinationCity || undefined,
      departureDate: departureDate || undefined,
      minPrice,
      maxPrice,
      availableSeats,
      sortBy,
      sortOrder
    };
    
    setActiveFilter(newFilter);
  };
  
  const clearFilters = () => {
    setDepartureCity('');
    setDestinationCity('');
    setDepartureDate('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setAvailableSeats(1);
    setSortBy('departureTime');
    setSortOrder('asc');
    
    setActiveFilter({
      availableSeats: 1,
      sortBy: 'departureTime',
      sortOrder: 'asc'
    });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white mb-6">Find Your Ride</h1>
          
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="From: City or location"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="To: City or location"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
              >
                <Filter className="h-4 w-4 mr-1" />
                {showFilters ? 'Hide filters' : 'Show more filters'}
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="relative rounded-md shadow-sm flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          placeholder="Min"
                          value={minPrice || ''}
                          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                          className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <span className="text-gray-500">to</span>
                      <div className="relative rounded-md shadow-sm flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          placeholder="Max"
                          value={maxPrice || ''}
                          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                          className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Minimum Seats
                    </label>
                    <select
                      value={availableSeats || ''}
                      onChange={(e) => setAvailableSeats(e.target.value ? Number(e.target.value) : undefined)}
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="1">1 seat</option>
                      <option value="2">2 seats</option>
                      <option value="3">3 seats</option>
                      <option value="4">4 seats</option>
                      <option value="5">5+ seats</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Sort By
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'price' | 'departureTime')}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="departureTime">Departure Time</option>
                        <option value="price">Price</option>
                      </select>
                      
                      <button
                        type="button"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {sortOrder === 'asc' ? (
                          <SortAsc className="h-5 w-5" />
                        ) : (
                          <SortDesc className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-primary-600 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search filters or searching for a different route to find available rides.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {rides.length} {rides.length === 1 ? 'ride' : 'rides'} found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRidePage;