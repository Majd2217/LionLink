const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Mailgun client with API key and domain
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: '678f5e0076bb462400373b9e50ca0400-5dcb5e36-cfec585d'  // Replace with your actual Mailgun API key
});

// Route to send the verification code
app.post('/send-verification', (req, res) => {
  const { email } = req.body;

  // Generate a random verification code
  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

  // Send the verification code via Mailgun
  mg.messages.create('sandbox2551fe2ad3e64f90bc9fbafb69269e65.mailgun.org', {
    from: "Excited User <mailgun@sandbox2551fe2ad3e64f90bc9fbafb69269e65.mailgun.org>",  // Verified sender email
    to: [email],  // Recipient's email, must be authorized for sandbox
    subject: "Your LionLink Verification Code",
    text: `Your verification code is: ${verificationCode}`,
    html: `<h1>Your verification code is: ${verificationCode}</h1>`,  // Optional HTML version
  })
  .then(msg => {
    console.log('Email sent:', msg);
    res.status(200).send('Verification code sent');
  })
  .catch(err => {
    console.error('Error sending email:', err);
    res.status(500).send('Error sending verification email');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
