const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const loginApi = require('./login'); // Import login API file
const addVisitor = require('./visitor');
const collections = require('./collections')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
  
app.use(bodyParser.json());

// Use the login API router
app.use(loginApi);
app.use(addVisitor)
app.use(collections)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
