const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer'); // 1. Import Nodemailer

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cors({ origin: '*' }));

// 2. Configure the email transporter engine
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shahebazkhannawabkhan@gmail.com',         // Your actual Gmail address
    pass: 'ivwa zgci rakf ncix'           // The 16-character App Password you generated
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required!" });
  }

  // Keep your local JSON file backup functioning
  const newMessage = { name, email, message, timestamp: new Date().toISOString() };
  const filePath = path.join(__dirname, 'messages.json');
  let messages = [];
  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  // 3. Set up the email blueprint layout
  const mailOptions = {
    from: 'shahebazkhannawabkhan@gmail.com', 
    to: 'shahebazkhannawabkhan@gmail.com',           // Where you want to receive the alerts (can be the same email)
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

  // 4. Fire the email off over the internet
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Nodemailer failed to send email:", error);
      // We still return success: true because the data saved to messages.json safely
      return res.status(200).json({ 
        success: true, 
        message: "Saved to database, but email dispatch failed." 
      });
    } else {
      console.log('📧 Email alert dispatched successfully: ' + info.response);
      return res.status(200).json({ 
        success: true, 
        message: "Data successfully saved and emailed!" 
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Your full-stack backend is listening on http://localhost:${PORT}`);
});