import express from 'express';
import Review from '../models/Review.js';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, async (req, res) => {
  const { rideId, revieweeId, rating, comment } = req.body;
  
  try {
    // Check if ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if ride is completed
    if (ride.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed rides' });
    }
    
    // Check if user was part of the ride
    const wasDriver = ride.driver.toString() === req.user.id;
    const wasPassenger = ride.passengers.some(p => 
      p.user.toString() === req.user.id && p.status === 'confirmed'
    );
    
    if (!wasDriver && !wasPassenger) {
      return res.status(401).json({ message: 'User not authorized to review this ride' });
    }
    
    // Check if reviewee was part of the ride
    const revieweeIsDriver = ride.driver.toString() === revieweeId;
    const revieweeIsPassenger = ride.passengers.some(p => 
      p.user.toString() === revieweeId && p.status === 'confirmed'
    );
    
    if (!revieweeIsDriver && !revieweeIsPassenger) {
      return res.status(400).json({ message: 'Can only review users who were part of the ride' });
    }
    
    // Check if reviewer is not reviewing themselves
    if (req.user.id === revieweeId) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({
      ride: rideId,
      reviewer: req.user.id,
      reviewee: revieweeId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists' });
    }
    
    // Create new review
    const newReview = new Review({
      ride: rideId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment
    });
    
    const review = await newReview.save();
    
    // Update user's rating
    const reviews = await Review.find({ reviewee: revieweeId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await User.findByIdAndUpdate(revieweeId, {
      rating: Math.round(averageRating * 10) / 10
    });
    
    // Populate review with user data
    await review.populate('reviewer', 'name email profilePicture');
    await review.populate('reviewee', 'name email profilePicture rating');
    
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get all reviews for a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('reviewer', 'name email profilePicture')
      .populate('reviewee', 'name email profilePicture rating')
      .populate('ride', 'departureLocation destinationLocation departureTime');
    
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reviews/ride/:rideId
// @desc    Get all reviews for a specific ride
// @access  Public
router.get('/ride/:rideId', async (req, res) => {
  try {
    const reviews = await Review.find({ ride: req.params.rideId })
      .sort({ createdAt: -1 })
      .populate('reviewer', 'name email profilePicture')
      .populate('reviewee', 'name email profilePicture rating');
    
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;