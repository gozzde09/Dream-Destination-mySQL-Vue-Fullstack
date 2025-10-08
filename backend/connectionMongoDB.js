// Import npm package
const mongoose = require("mongoose");

// Create a mongoose connection object with connection parameters
const connectionMongoDB = async () => {
  // Use try-catch block to handle any potential errors during connection
  try {
    // Attempt to connect to MongoDB using the specified connection string
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/webserverprojektetMongoDB"
    );
  } catch (error) {
    // If an error occurs during connection, log the error to the console
    console.error(error);
    // Exit the Node.js process with an error code (1)
    process.exit(1);
  }
};

// Export the Mongo connection object to make it accessible in other modules
module.exports = connectionMongoDB;
