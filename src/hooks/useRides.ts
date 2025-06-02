import { useState, useEffect } from 'react';
import axios from 'axios';
import { Ride, RideFilter } from '../types';
import { useAuth } from '../context/AuthContext';

export const useRides = (filter?: RideFilter) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        
        // Build query string from filter
        let queryParams = '';
        if (filter) {
          const params = new URLSearchParams();
          if (filter.departureCity) params.append('departureCity', filter.departureCity);
          if (filter.destinationCity) params.append('destinationCity', filter.destinationCity);
          if (filter.departureDate) params.append('departureDate', filter.departureDate);
          if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
          if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
          if (filter.availableSeats !== undefined) params.append('availableSeats', filter.availableSeats.toString());
          if (filter.sortBy) params.append('sortBy', filter.sortBy);
          if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
          
          queryParams = `?${params.toString()}`;
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rides${queryParams}`, {
          headers
        });
        
        setRides(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching rides');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRides();
  }, [filter, token]);
  
  return { rides, loading, error };
};

export const useUserRides = (type: 'driver' | 'passenger') => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  
  useEffect(() => {
    const fetchUserRides = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const endpoint = type === 'driver' ? 'user/driver' : 'user/passenger';
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rides/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setRides(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || `Error fetching your ${type} rides`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRides();
  }, [token, type]);
  
  return { rides, loading, error };
};

export const useRideDetails = (rideId: string | undefined) => {
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  
  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rides/${rideId}`, {
          headers
        });
        
        setRide(res.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching ride details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRideDetails();
  }, [rideId, token]);
  
  return { ride, loading, error };
};