// The official MongoDB package driver for Node.js
const mongodb = require('mongodb');

// Extract MongoClient constructor 
const MongoClient = mongodb.MongoClient;

// Require and configure dotenv module, which loads environment variables from a .env file into process.env
require('dotenv').config(); 

// Connection URL to the MongoDB Cluster
const url = 'mongodb+srv://' + 
            process.env.MONGO_ATLAS_USER + 
            ':' + 
            process.env.MONGO_ATLAS_PASSWORD + 
            '@cluster0-ifmd1.mongodb.net/shop?retryWrites=true';
            

// Wrap MongoDB connection code into mongoConnect method
const mongoConnect = callback => {
    // Use connect method to connect to the server (Create connection to MongoDB)
    MongoClient.connect(url, { 
        useNewUrlParser: true 
    })
    // If connection to the database is successful
    .then(client => {
        _db = client.db();
        callback();
        console.log('Successfully connected to the database');
    })
    // If connection to the database fails
    .catch(err => {
        // Ouput the error message
        console.log('Connection to the database failed', err);
    });
};

// Create a concept that we can reuse which allows us to get access to the database connection 
const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found!';
}

// Export the modules
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;