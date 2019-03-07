// The official MongoDB driver for Node.js
const mongodb = require('mongodb');
// Extract MongoClient constructor 
const MongoClient = mongodb.MongoClient;

// Connection URL to the MongoDB Cluster
const url = 'mongodb+srv://MileMijatovic:GuNF985YQtXRbSPB@cluster0-ifmd1.mongodb.net/shop?retryWrites=true';

// Wrap and execute MongoDB connection code into mongoConnect method
const mongoConnect = callback => {
    // Use connect method to connect to the server (Create connection to MongoDB)
    MongoClient.connect(url, { useNewUrlParser: true })
    // If connection to the database is successful
    .then(client => {
        _db = client.db();
        callback();
    })
    // If connection to database fails
    .catch(err => {
        // Ouput the error message
        console.log('Error', err);
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