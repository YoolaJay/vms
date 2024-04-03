const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');


// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON bodies
router.use(express.json());

// GET route to fetch visitors data
// router.get('/visitors', async (req, res) => {
//     try {
//         // Connect to MongoDB
//         await client.connect();

//         // Access database and collection
//         const db = client.db('vms');
//         const visitorsCollection = db.collection('visitors');

//         // Find all visitors from the collection
//         const visitors = await visitorsCollection.find({}).toArray();

//         // Send the visitors data as a response
//         res.status(200).json(visitors);
//     } catch (error) {
//         // Handle errors
//         console.error('Error fetching visitors:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         // Close MongoDB connection
//         await client.close();
//     }
// });

router.get('/visitors', async (req, res) => {
    try {
        // Connect to MongoDB
        await client.connect();

        // Access database
        const db = client.db('vms');
        
        // Get today's date
        const today = new Date();
        const collectionName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        // Access the collection for today's date
        const visitorsCollection = db.collection(collectionName);

        // Find all visitors from the collection for today's date
        const visitors = await visitorsCollection.find({}).toArray();

        // Send the visitors data as a response
        res.status(200).json(visitors);
    } catch (error) {
        // Handle errors
        console.error('Error fetching visitors:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close MongoDB connection
        await client.close();
    }
});

// POST route for adding a new visitor
// router.post('/visitors', async (req, res) => {
//     try {
//         // Get visitor data from request body
//         const { firstName, lastName, phoneNumber, timeIn, timeOut} = req.body;

//         // Connect to MongoDB
//         await client.connect();

//         // Access database and collection
//         const db = client.db('vms');
//         const visitorsCollection = db.collection('visitors');

//         // Insert the new visitor into the database
//         const result = await visitorsCollection.insertOne({ firstName, lastName, phoneNumber, timeIn, timeOut });

//         // Send a success response
//         res.status(201).json({ message: 'Visitor added successfully'});
//     } catch (error) {
//         // Handle errors
//         console.error('Error adding visitor:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         // Close MongoDB connection
//         await client.close();
//     }
// });

router.post('/visitors', async (req, res) => {
    try {
        // Get visitor data from request body
        const { firstName, lastName, phoneNumber, visitee, timeIn, timeOut} = req.body;

        // Connect to MongoDB
        await client.connect();

        // Access database and create collection with current day's date
        const db = client.db('vms');
        const today = new Date();
        const collectionName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        const visitorsCollection = db.collection(collectionName);

        // Insert the new visitor into the database
        const result = await visitorsCollection.insertOne({ firstName, lastName, phoneNumber, visitee, timeIn, timeOut });

        // Send a success response
        res.status(201).json({ message: 'Visitor added successfully'});
    } catch (error) {
        // Handle errors
        console.error('Error adding visitor:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close MongoDB connection
        await client.close();
    }
});

// POST route for checking out a visitor
// router.post('/visitors/checkout', async (req, res) => {
//     console.log('Hey there')
//     try {
//         // Get checkout data from request body
//         const { firstName, lastName, phoneNumber, timeOut } = req.body;

//         // Connect to MongoDB
//         await client.connect();

//         // Access database and collection
//         const db = client.db('vms');
//         const visitorsCollection = db.collection('visitors');

//         // Find the visitor to check out
//         const visitor = await visitorsCollection.findOneAndUpdate(
//             { firstName, lastName, phoneNumber, timeOut: 'pending' },
//             { $set: { timeOut } }
//         );

//         // if (!visitor.value || !visitor.value) {
//         //     return res.status(404).json({ message: 'Visitor not found or already checked out' });
//         // }

//         // Send a success response
//         res.status(200).json({ message: 'Visitor checked out successfully', visitor: visitor.value });
//     } catch (error) {
//         // Handle errors
//         console.error('Error checking out visitor:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         // Close MongoDB connection
//         await client.close();
//     }
// });

router.post('/visitors/checkout', async (req, res) => {
    try {
        // Get checkout data from request body
        const { firstName, lastName, phoneNumber, visitee, timeOut } = req.body;

        // Connect to MongoDB
        await client.connect();

        // Access database
        const db = client.db('vms');
        
        // Get today's date
        const today = new Date();
        const collectionName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        // Access the collection for today's date
        const visitorsCollection = db.collection(collectionName);

        // Find the visitor to check out in today's collection
        const visitor = await visitorsCollection.findOneAndUpdate(
            { firstName, lastName, phoneNumber, visitee, timeOut: 'pending' },
            { $set: { timeOut} } // Set checkout time to current time
        );

        // if (!visitor.value) {
        //     return res.status(404).json({ message: 'Visitor not found or already checked out' });
        // }

        // Send a success response
        res.status(200).json({ message: 'Visitor checked out successfully', visitor: visitor.value });
    } catch (error) {
        // Handle errors
        console.error('Error checking out visitor:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close MongoDB connection
        await client.close();
    }
});


// PUT route for updating visitor details
router.put('/visitors/:id', async (req, res) => {
    try {
        // Get visitor ID from request parameters
        // const visitorId = req.params.id;

        const id = req.params.id;

        // Get updated visitor data from request body
        const { firstName, lastName, phoneNumber, visitee } = req.body;

        // Connect to MongoDB
        await client.connect();

        // Access database and collection
        const db = client.db('vms');
        
        // Get today's date
        const today = new Date();
        const collectionName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        // Access the collection for today's date
        const visitorsCollection = db.collection(collectionName);

        // Update the visitor document in the collection
        const result = await visitorsCollection.updateOne(
            { _id: new ObjectId(id) }, // Match visitor by ID
            { $set: { firstName, lastName, phoneNumber, visitee } } // Set updated data
        );

        // Check if the visitor was found and updated
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Visitor not found or already updated' });
        }

        // Send a success response
        res.status(200).json({ message: 'Visitor updated successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error updating visitor:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close MongoDB connection
        await client.close();
    }
});


// DELETE route for deleting a visitor
router.delete('/visitors/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Connect to MongoDB
        await client.connect();

        // Access database and collection
        const db = client.db('vms');

        const today = new Date();
        const collectionName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        const visitorsCollection = db.collection(collectionName);

        // Delete the visitor document from the collection
        const result = await visitorsCollection.deleteOne({ _id: new ObjectId(id) });

        // Check if the visitor was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Visitor not found or already deleted' });
        }

        // Send a success response
        res.status(200).json({ message: 'Visitor deleted successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error deleting visitor:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close MongoDB connection
        await client.close();
    }
});

module.exports = router;
