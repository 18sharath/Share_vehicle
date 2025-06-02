export interface User {
  _id: string;
  name: string;
  email: string;
  isDriver: boolean;
  createdAt: string;
  profilePicture?: string;
  phone?: string;
  bio?: string;
  rating?: number;
  totalRides?: number;
}

export interface Ride {
  _id: string;
  driver: User;
  departureLocation: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  destinationLocation: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  departureTime: string;
  estimatedArrivalTime: string;
  price: number;
  availableSeats: number;
  description?: string;
  carDetails?: {
    make: string;
    model: string;
    color: string;
    licensePlate?: string;
  };
  passengers: {
    user: User;
    status: 'pending' | 'confirmed' | 'cancelled';
    pickupPoint?: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    dropoffPoint?: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  estimatedTimeToPickup?: number;
}

export interface RideFilter {
  departureCity?: string;
  destinationCity?: string;
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
  availableSeats?: number;
  sortBy?: 'price' | 'departureTime' | 'arrivalProximity';
  sortOrder?: 'asc' | 'desc';
}

export interface Booking {
  _id: string;
  ride: Ride;
  passenger: User;
  status: 'pending' | 'confirmed' | 'cancelled';
  pickupPoint?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  dropoffPoint?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt: string;
}

export interface Review {
  _id: string;
  ride: string;
  reviewer: User;
  reviewee: User;
  rating: number;
  comment?: string;
  createdAt: string;
}