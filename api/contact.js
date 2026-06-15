const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Message = require('./Message'); // Import our database layout

// === 1. MONGODB DATABASE CONNECTION ===
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  // PASTE YOUR ACTUAL STRING HERE DIRECTLY FOR A FORCED TEST
  const directURI = "mongodb+srv://shahebaz_admin:sknk1234@cluster0.datfwwn.mongodb.net/?appName=Cluster0";

  try {
    // Delete the process.env line completely so it doesn't crash your server
    await mongoose.connect(directURI);
    console.log("📥 MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    throw error;
  }
// === 2. EMAIL ENGINE SETUP ===
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  requireTLS: true,
  auth: {
    user: 'shahebazkhannawabkhan@gmail.com', // Replace with your real Gmail address
    pass: process.env.GMAIL_PASS         
  }
});

// === 3. SERVERLESS CONTROLLER ===
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: "🚀 Backend with Database is live!" });
  }

  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required!" });
    }

    try {
      // Connect to the database cluster
      await connectDB();

      // Save the message permanently to MongoDB Atlas
      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      console.log("💾 Message saved to database cluster!");

      // Construct and dispatch Email Payload
      const mailOptions = {
        from: 'shahebazkhannawabkhan@gmail.com', // Replace with your real Gmail address
        to: 'shahebazkhannawabkhan@gmail.com',   // Replace with your real Gmail address
        subject: `💼 New Portfolio Message from ${name}`,
        html: `
          <h3>You have a new contact form submission!</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 10px; background: #f4f4f4; border-left: 4px solid #646cff;">
            ${message}
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "Message securely saved and emailed!" });

    } catch (error) {
      console.error("❌ Process failure:", error);
      return res.status(500).json({ success: false, error: "Failed to process form submission." });
    }
  }

  return res.status(405).json({ success: false, error: "Method Not Allowed" });
};
