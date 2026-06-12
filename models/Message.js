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

// Export the model. The conditional check prevents Mongoose from re-compiling the model on hot-reloads.
module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);