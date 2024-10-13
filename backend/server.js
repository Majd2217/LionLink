const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mongoose = require('mongoose');  // MongoDB integration
require('dotenv').config();  // Load environment variables from .env file (optional, but recommended)

// Assume you have a scraping function in another file (scraper.js)
// You would import it here
const scrapeEvents = require('./scraper');  // Make sure this function is implemented

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Mailgun client with API key and domain
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '678f5e0076bb462400373b9e50ca0400-5dcb5e36-cfec585d'  // Use environment variables for better security
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lionlink')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });

// Define a Post schema
const PostSchema = new mongoose.Schema({
  title: String,
  details: String,
  timestamp: String
});

const Post = mongoose.model('Post', PostSchema);

// Route to send the verification code via Mailgun
app.post('/send-verification', (req, res) => {
  const { email } = req.body;

  // Generate a random verification code
  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();

  // Send the verification code via Mailgun
  mg.messages.create('sandbox2551fe2ad3e64f90bc9fbafb69269e65.mailgun.org', {
    from: "Excited User <mailgun@sandbox2551fe2ad3e64f90bc9fbafb69269e65.mailgun.org>",
    to: [email],
    subject: "Your LionLink Verification Code",
    text: `Your verification code is: ${verificationCode}`,
    html: `<h1>Your verification code is: ${verificationCode}</h1>`
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

// Route to get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();  // Retrieve all posts from MongoDB
    res.json(posts);
  } catch (error) {
    res.status(500).send('Error retrieving posts');
  }
});

// Route to create a new post
app.post('/posts', async (req, res) => {
  const { title, details } = req.body;
  
  const post = new Post({
    title: title,
    details: details,
    timestamp: new Date().toLocaleString()
  });

  try {
    await post.save();  // Save the post to MongoDB
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send('Error saving the post');
  }
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

