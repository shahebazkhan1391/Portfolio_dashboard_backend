const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// === 1. MIDDLEWARE CONFIGURATION (MUST BE FIRST) ===
app.use(cors({ origin: '*' })); // Allows any frontend to access this backend
app.use(express.json());        // CRUCIAL: Tells Express how to read incoming JSON form data!

// === 2. EMAIL ENGINE SETUP ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shahebazkhannawabkhan@gmail.com', // Replace with your real Gmail address
    pass: process.env.GMAIL_PASS         // Reads safely from Render environment variables
  }
});

// === 3. ROUTE HANDLERS ===
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required!" });
  }

  // Backup data to local JSON file
  const newMessage = { name, email, message, timestamp: new Date().toISOString() };
  const filePath = path.join(__dirname, 'messages.json');
  let messages = [];
  if (fs.existsSync(filePath)) {
    try {
      messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      messages = [];
    }
  }
  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

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
      return res.status(200).json({ success: true, message: "Saved locally, email failed." });
    }
    console.log('📧 Email sent successfully: ' + info.response);
    return res.status(200).json({ success: true, message: "Message received and emailed!" });
  });
});

// Wildcard route using the new required Express syntax to avoid path-to-regexp crash
app.get('/:path*', (req, res) => {
  res.send("🚀 Portfolio Backend Server is running smoothly!");
});

// === 4. START ENGINE ===
app.listen(PORT, () => {
  console.log(`🚀 Server listening smoothly on port ${PORT}`);
});