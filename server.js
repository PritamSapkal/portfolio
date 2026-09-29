require('dotenv').config();

const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error('Missing EMAIL_USER or EMAIL_PASS. Copy .env.example to .env and configure your SMTP credentials.');
  process.exit(1);
}

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(__dirname));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !name.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !message.trim() ||
    name.length > 200 ||
    email.length > 320 ||
    message.length > 10000
  ) {
    return res.status(400).json({ success: false, message: 'Please provide a valid name, email, and message.' });
  }

  const senderName = name.trim().replace(/[\r\n]+/g, ' ');
  const senderEmail = email.trim();

  try {
    await mailer.sendMail({
      from: emailUser,
      to: 'pritam.s0752@gmail.com',
      replyTo: senderEmail,
      subject: `Portfolio Contact: Message from ${senderName}`,
      text: `Name: ${senderName}\nEmail: ${senderEmail}\nMessage: ${message.trim()}`
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send portfolio contact email:', error);
    return res.status(500).json({ success: false, message: 'Email could not be sent. Please try again later.' });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'portfolio.html')));

app.listen(PORT, () => {
  console.log(`Contact server listening on port ${PORT}`);
});
