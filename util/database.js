// The official MongoDB driver for Node.js
const mongodb = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb+srv://MileMijatovic:GuNF985YQtXRbSPB@cluster0-ifmd1.mongodb.net/test?retryWrites=true';

// Wrap and execute MongoDB connection code into mongoConnect function
const mongoConnect = callback => {
    // Use connect method to connect to the server
    mongodb.connect(url, { useNewUrlParser: true })
    // If connection to the database is successful
    .then(client => {
        console.log('Successfully connected to the MongoDB!');
        callback(client);
    })
    // If connection to database failsS
    .catch(err => {
        // Ouput the error message
        console.log('Error', err);
    });
};

// Export the mongoConnect module
module.exports = mongoConnect;