import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isDriver: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String
  },
  phone: {
    type: String
  },
  bio: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRides: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);