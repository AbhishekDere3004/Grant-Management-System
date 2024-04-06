
const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 1010;
app.use(express.json());
const dbconnect = require("./config/database");
const router = require("./routes/router");

// Import controller
const allUserController = require('./controllers/allUserController');


// Connect to MongoDB
dbconnect();

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", router);

// Start the server
app.listen(PORT, () => {
 
console.log(`Server running on http://localhost:${PORT}`);

});

