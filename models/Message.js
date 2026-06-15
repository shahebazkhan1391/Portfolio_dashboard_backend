const mongoose = require('mongoose');

// Define exactly what data fields we want to save in MongoDB
const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically logs exactly when they sent it
  }
});

// This absolute assignment format is much safer for Vercel's hot-reloads
module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
