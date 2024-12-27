// Import the app instance
const app = require('./app'); 

// Load environment variables
require('dotenv').config();

// Define the PORT, defaulting to 5000 if not in environment variables
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified PORT
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
