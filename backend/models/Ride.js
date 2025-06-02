import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departureLocation: {
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  destinationLocation: {
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  departureTime: {
    type: Date,
    required: true
  },
  estimatedArrivalTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String
  },
  carDetails: {
    make: {
      type: String
    },
    model: {
      type: String
    },
    color: {
      type: String
    },
    licensePlate: {
      type: String
    }
  },
  passengers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
      },
      pickupPoint: {
        address: {
          type: String
        },
        coordinates: {
          lat: Number,
          lng: Number
        }
      },
      dropoffPoint: {
        address: {
          type: String
        },
        coordinates: {
          lat: Number,
          lng: Number
        }
      }
    }
  ],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Ride', RideSchema);