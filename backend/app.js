// Import required modules
const express = require('express');
const cors = require('cors');
// Create an Express application
const app = express();

/*==================================*/
/*==== ADD FUNCTIONALITY to APP ====*/
/*==================================*/

// Add Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Add Middleware to parse JSON bodies
app.use(express.json());

// Add Middleware to parse URL-encoded data in incoming requests
app.use(express.urlencoded({ extended: true }));

// Set the static folder 'public' to serve static files like HTML, CSS, and JavaScript
app.use(express.static('public'));

// Add routes
const countryRoutes = require("./routes/countryRoutes");
app.use(countryRoutes);

const reviewRoutes = require("./routes/reviewRoutes");
app.use(reviewRoutes);

const continentRoutes = require("./routes/continentRoutes");
app.use(continentRoutes);

const langCurrencyRoutes = require("./routes/langCurrencyRoutes");
app.use(langCurrencyRoutes);

const connectionMongoDB = require("./connectionMongoDB");
connectionMongoDB();

/*============================*/
/*=== Server Configuration ===*/
/*============================*/

// Specify the port the server should listen on
const port = 3000;

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
