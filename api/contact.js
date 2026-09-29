const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    const message = 'Please provide a valid name, email, and message.';
    return res.status(400).json({ success: false, error: message, message });
  }

  const senderName = name.trim().replace(/[\r\n]+/g, ' ');
  const senderEmail = email.trim();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: 'pritam.s0752@gmail.com',
      replyTo: senderEmail,
      subject: `Portfolio Message from ${senderName}`,
      text: `Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message.trim()}`
    });
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: 'Email could not be sent. Please try again later.'
    });
  }
};
