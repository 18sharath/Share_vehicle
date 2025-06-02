import express from 'express';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { auth, driverRequired } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/rides
// @desc    Create a new ride
// @access  Private (drivers only)
router.post('/', [auth, driverRequired], async (req, res) => {
  const {
    departureLocation,
    destinationLocation,
    departureTime,
    estimatedArrivalTime,
    price,
    availableSeats,
    description,
    carDetails
  } = req.body;
  
  try {
    const newRide = new Ride({
      driver: req.user.id,
      departureLocation,
      destinationLocation,
      departureTime,
      estimatedArrivalTime,
      price,
      availableSeats,
      description,
      carDetails
    });
    
    const ride = await newRide.save();
    await ride.populate('driver', 'name email profilePicture rating');
    
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rides
// @desc    Get all rides with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      departureCity,
      destinationCity,
      departureDate,
      minPrice,
      maxPrice,
      availableSeats,
      sortBy,
      sortOrder
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (departureCity) {
      filter['departureLocation.city'] = new RegExp(departureCity, 'i');
    }
    
    if (destinationCity) {
      filter['destinationLocation.city'] = new RegExp(destinationCity, 'i');
    }
    
    if (departureDate) {
      const start = new Date(departureDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(departureDate);
      end.setHours(23, 59, 59, 999);
      
      filter.departureTime = { $gte: start, $lte: end };
    }
    
    if (minPrice !== undefined) {
      filter.price = { $gte: Number(minPrice) };
    }
    
    if (maxPrice !== undefined) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    
    if (availableSeats !== undefined) {
      filter.availableSeats = { $gte: Number(availableSeats) };
    }
    
    // Only show scheduled rides
    filter.status = 'scheduled';
    
    // Build sort object
    const sort = {};
    
    if (sortBy === 'price') {
      sort.price = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'departureTime') {
      sort.departureTime = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by departureTime ascending
      sort.departureTime = 1;
    }
    
    const rides = await Ride.find(filter)
      .sort(sort)
      .populate('driver', 'name email profilePicture rating')
      .populate('passengers.user', 'name email profilePicture');
    
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rides/:id
// @desc    Get ride by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email profilePicture rating phone')
      .populate('passengers.user', 'name email profilePicture');
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/rides/:id
// @desc    Update a ride
// @access  Private (ride's driver only)
router.put('/:id', auth, async (req, res) => {
  try {
    let ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user is the ride's driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Only allow updates if ride is still scheduled
    if (ride.status !== 'scheduled') {
      return res.status(400).json({ message: 'Cannot update a ride that is already in progress, completed, or cancelled' });
    }
    
    const {
      departureLocation,
      destinationLocation,
      departureTime,
      estimatedArrivalTime,
      price,
      availableSeats,
      description,
      carDetails
    } = req.body;
    
    // Update fields
    if (departureLocation) ride.departureLocation = departureLocation;
    if (destinationLocation) ride.destinationLocation = destinationLocation;
    if (departureTime) ride.departureTime = departureTime;
    if (estimatedArrivalTime) ride.estimatedArrivalTime = estimatedArrivalTime;
    if (price) ride.price = price;
    if (availableSeats !== undefined) ride.availableSeats = availableSeats;
    if (description) ride.description = description;
    if (carDetails) ride.carDetails = carDetails;
    
    await ride.save();
    await ride.populate('driver', 'name email profilePicture rating');
    await ride.populate('passengers.user', 'name email profilePicture');
    
    res.json(ride);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/rides/:id
// @desc    Delete a ride
// @access  Private (ride's driver only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user is the ride's driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Only allow deletion if ride is still scheduled and has no confirmed passengers
    if (ride.status !== 'scheduled') {
      return res.status(400).json({ message: 'Cannot delete a ride that is already in progress or completed' });
    }
    
    const hasConfirmedPassengers = ride.passengers.some(p => p.status === 'confirmed');
    if (hasConfirmedPassengers) {
      return res.status(400).json({ message: 'Cannot delete a ride with confirmed passengers' });
    }
    
    await ride.deleteOne();
    
    res.json({ message: 'Ride removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/rides/:id/status
// @desc    Update ride status
// @access  Private (ride's driver only)
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  
  // Validate status
  if (!['scheduled', 'in-progress', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    let ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user is the ride's driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    ride.status = status;
    await ride.save();
    
    res.json({ status: ride.status });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rides/user/driver
// @desc    Get all rides created by the current user (as driver)
// @access  Private
router.get('/user/driver', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user.id })
      .sort({ departureTime: -1 })
      .populate('driver', 'name email profilePicture rating')
      .populate('passengers.user', 'name email profilePicture');
    
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rides/user/passenger
// @desc    Get all rides the current user is a passenger of
// @access  Private
router.get('/user/passenger', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ 'passengers.user': req.user.id })
      .sort({ departureTime: -1 })
      .populate('driver', 'name email profilePicture rating')
      .populate('passengers.user', 'name email profilePicture');
    
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;