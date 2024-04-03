const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// router.use(cors({
//     origin: 'http://127.0.0.1:5500'
//   }));

// Middleware to parse JSON bodies
router.use(express.json());

// POST route for user login
router.post('/login', async (req, res) => {
    console.log('login-api active')
  try {
    // Get username and password from request body
    const { username, password } = req.body;

    // Connect to MongoDB
    await client.connect();

    // Access database and collection
    const db = client.db('vms');
    const usersCollection = db.collection('users');

    // Check if the user exists in the database
    const user = await usersCollection.findOne({ username, password });

    // If user exists, send success response
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    //   res.redirect('/dashboard.html');
    } else {
      // If user doesn't exist or password is incorrect, send error response
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
    // res.status(500).send('<script>alert("Internal server error"); window.location="/login.html";</script>')
  } finally {
    // Close MongoDB connection
    await client.close();
  }
});

module.exports = router;
