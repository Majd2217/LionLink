const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const scrapeEvents = require('./scraper');  // Adjusted import assuming scraper.js is in the same directory

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Mailgun client with your API key and domain (keys and domains unchanged)
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: '678f5e0076bb462400373b9e50ca0400-5dcb5e36-cfec585d'  // Your API Key (unchanged)
});

// Route to send the verification code
app.post('/send-verification', (req, res) => {
  const { email } = req.body;

  // Generate a random verification code
  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

  // Send the verification code via Mailgun
  mg.messages.create('sandbox2551fe2ad3e64f90bc9fbafb69269e65.mailgun.org', {
    from: "Excited User <mailgun@sandbox2551fe2ad3e64f90bc9fbafb69269e65.mailgun.org>",  // Your verified sender email (unchanged)
    to: [email],  // Recipient's email (unchanged)
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

// Route to serve scraped events
app.get('/scraped-events', async (req, res) => {
  const events = await scrapeEvents();
  res.json(events);  // Send the scraped events to the frontend as JSON
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
