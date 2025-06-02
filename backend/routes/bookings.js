import express from 'express';
import Booking from '../models/Booking.js';
import Ride from '../models/Ride.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Book a ride
// @access  Private
router.post('/', auth, async (req, res) => {
  const { rideId, pickupPoint, dropoffPoint } = req.body;
  
  try {
    // Check if the ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if ride is still scheduled
    if (ride.status !== 'scheduled') {
      return res.status(400).json({ message: 'This ride is no longer available for booking' });
    }
    
    // Check if user is trying to book their own ride
    if (ride.driver.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot book your own ride' });
    }
    
    // Check if there are available seats
    if (ride.availableSeats < 1) {
      return res.status(400).json({ message: 'No seats available on this ride' });
    }
    
    // Check if user has already booked this ride
    const existingBooking = await Booking.findOne({
      ride: rideId,
      passenger: req.user.id
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this ride' });
    }
    
    // Create a new booking
    const newBooking = new Booking({
      ride: rideId,
      passenger: req.user.id,
      pickupPoint,
      dropoffPoint
    });
    
    const booking = await newBooking.save();
    
    // Add passenger to ride
    ride.passengers.push({
      user: req.user.id,
      status: 'pending',
      pickupPoint,
      dropoffPoint
    });
    
    await ride.save();
    
    // Populate booking details
    await booking.populate('ride');
    await booking.populate('passenger', 'name email profilePicture');
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (confirm/cancel)
// @access  Private (ride's driver only)
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  
  // Validate status
  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const ride = await Ride.findById(booking.ride);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user is the ride's driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update booking status
    booking.status = status;
    await booking.save();
    
    // Update passenger status in the ride
    const passengerIndex = ride.passengers.findIndex(
      p => p.user.toString() === booking.passenger.toString()
    );
    
    if (passengerIndex !== -1) {
      ride.passengers[passengerIndex].status = status;
      
      // Update available seats if confirmed
      if (status === 'confirmed') {
        ride.availableSeats = Math.max(0, ride.availableSeats - 1);
      } else if (status === 'cancelled' && ride.passengers[passengerIndex].status === 'confirmed') {
        ride.availableSeats += 1;
      }
      
      await ride.save();
    }
    
    res.json({ message: `Booking ${status}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking (by passenger)
// @access  Private (booking's passenger only)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the booking's passenger
    if (booking.passenger.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Only allow cancellation if booking is not already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    const ride = await Ride.findById(booking.ride);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Update passenger status in the ride
    const passengerIndex = ride.passengers.findIndex(
      p => p.user.toString() === booking.passenger.toString()
    );
    
    if (passengerIndex !== -1) {
      const wasConfirmed = ride.passengers[passengerIndex].status === 'confirmed';
      ride.passengers[passengerIndex].status = 'cancelled';
      
      // Update available seats if booking was confirmed
      if (wasConfirmed) {
        ride.availableSeats += 1;
      }
      
      await ride.save();
    }
    
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/user
// @desc    Get all bookings for the current user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'ride',
        populate: {
          path: 'driver',
          select: 'name email profilePicture rating'
        }
      });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/bookings/ride/:rideId
// @desc    Get all bookings for a specific ride
// @access  Private (ride's driver only)
router.get('/ride/:rideId', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user is the ride's driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    const bookings = await Booking.find({ ride: req.params.rideId })
      .sort({ createdAt: -1 })
      .populate('passenger', 'name email profilePicture rating');
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;