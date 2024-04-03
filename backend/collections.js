// const express = require('express');
// const router = express.Router();
// const { MongoClient } = require('mongodb');
// const { ObjectId } = require('mongodb');


// // MongoDB connection URI
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Middleware to parse JSON bodies
// router.use(express.json());

const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// GET route to fetch collections with dates as their names
router.get('/visitors/collections', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();

    // Access database
    const db = client.db('vms');

    // Get list of collection names
    const collectionNames = await db.listCollections().toArray();

    // Filter collection names to only include those with date format
    const dateCollections = collectionNames.filter(collection => /\d{4}-\d{2}-\d{2}/.test(collection.name));

    // Fetch total number of visitors in each collection
    const collectionsWithVisitors = await Promise.all(dateCollections.map(async collection => {
      const count = await db.collection(collection.name).countDocuments();
      return { name: collection.name, totalVisitors: count };
    }));

    // Send collections data as response
    res.status(200).json(collectionsWithVisitors);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
});

// GET route to fetch data from a specific collection
router.get('/visitors/collections/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;
  try {
    // Connect to MongoDB
    await client.connect();

    // Access database
    const db = client.db('vms');

    // Fetch data from the specified collection
    const data = await db.collection(collectionName).find({}).toArray();

    // Send data as response
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching data from collection '${collectionName}':`, error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
});

module.exports = router;
