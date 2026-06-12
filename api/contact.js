const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// === 1. MIDDLEWARE CONFIGURATION ===
app.use(cors({ origin: '*' })); 
app.use(express.json());        

// === 2. EMAIL ENGINE SETUP ===
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS configuration required by Vercel cloud architecture
  requireTLS: true,
  auth: {
    user: 'shahebazkhannawabkhan@gmail.com', // Replace with your real Gmail address
    pass: process.env.GMAIL_PASS         // Will be safely read from Vercel's Dashboard
  }
});

// === 3. ROUTE HANDLER FOR VERCEL ===
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required!" });
  }

  // Construct Email Payload
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

  // Dispatch Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Nodemailer failed:", error);
      return res.status(500).json({ success: false, error: "Email delivery failed." });
    }
    console.log('📧 Email sent successfully: ' + info.response);
    return res.status(200).json({ success: true, message: "Message received and emailed!" });
  });
});

// Export the express engine for Vercel's Serverless environment handler
module.exports = app;