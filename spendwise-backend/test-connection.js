const mongoose = require('mongoose');
require('dotenv').config();

// Get the connection string from environment variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spendwise';

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', mongoURI);

// Set up MongoDB connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Event handlers for the connection
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('✅ Successfully connected to MongoDB!');
  console.log('Database name:', db.name);
  
  // List all collections
  db.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
      process.exit(1);
    }
    
    console.log('\nCollections in the database:');
    if (collections.length === 0) {
      console.log('No collections found. This is normal for a new database.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close the connection
    mongoose.connection.close();
  });
});

// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('\nMongoDB connection closed through app termination');
    process.exit(0);
  });
});
