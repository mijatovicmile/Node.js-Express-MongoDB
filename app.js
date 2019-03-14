// Include flexible Node.js web application framework that provides a robust set of features for our application
const express = require('express');

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require('body-parser');

// The path module provides utilities for working with file and directory paths
const path = require('path');

// Import admin routes module in our app
const adminRoutes = require('./routes/admin');

// Import shop routes module in our app
const shopRoutes = require('./routes/shop');

// Import auth routes (login and registration page)
const authRoutes = require('./routes/auth');

// Import error controller, which we will use for Page Not Found (404)
const errorController = require('./controllers/error');

// MongoDB connection code as a function (because I am exporting a mongoConnect function)
const mongoConnect = require('./util/database').mongoConnect;

// Session middleware for Express
const session = require('express-session');

/**
 * This module exports a single function which takes an instance of connect (or Express) 
 * and returns a MongoDBStore class that can be used to store sessions in MongoDB
 */
const MongoDBStore = require('connect-mongodb-session')(session);

// Import User model
const User = require('./models/user');

// Connection URL to the MongoDB Cluster
const MONGODB_URI = 'mongodb+srv://MileMijatovic:GuNF985YQtXRbSPB@cluster0-ifmd1.mongodb.net/shop';

/**
 * Create an Express application and store it in a constant named app, by running express() as a function
 */
const app = express();

const store = new MongoDBStore({
    // MongoDB Connection string
    uri: MONGODB_URI,
    // The MongoDB collection to store sessions in 'sessions' collection
    collection: 'sessions'
  });

/**
 * Parse incoming request bodies in a middleware before handlers, available under the req.body property.
 */
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * A template engine enables you to use static template files in our application. 
 * At runtime, the template engine replaces variables in a template file with actual values, 
 * and transforms the template into an HTML file sent to the client.
 * 
 * views - the directory where the template files are located
 * view engine - the template engine to use
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Serve static files such as images, CSS files, and JavaScript files,
 * use the express.static built-in middleware function in Express.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Instead of storing the information that the user is authenticated in the frontend, 
 * I will use sessions which is stored on the server side by using the session
 * 
 * A client needs to tell the server to which session he belongs because the session will 
 * be in stored in the memory or in the database
 * 
 * I want to share the authenticated information across all request 
 * of the same user, so the other users cant see other user data
 * (not sharing data across users) - different user will have different sessions
 */
app.use(session({ 
    // This is the secret used to sign the session ID cookie
    secret: 'my secret', 
    // Forces the session to be saved back to the session store, even if the session was never modified during the request
    resave: false, 
    // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified
    saveUninitialized: false,
    // Store user session data to the MongoDB
    store: store
}));

// Find a user by id and then store it in the request
app.use((req, res, next) => {
    User.findUserById("5c81810001b7e787acc0dcd2")
        .then(user => {
            // Store user in the request (the user I'm storing here will be an object with the properties)
            req.user = new User(
                user.name,
                user.email,
                user.cart,
                user._id
            );
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

/**
 * Register and use admin routes module in our application, which we defined in "../routes/admin"
 * Also we added "admin" filtering segment path, and based on that, only routes with "/admin" 
 * will go info the adminRoutes file. 
 * And not only that! Also , Express.js will also omit or ignore this "/admin" in the URL , 
 * when it tries to match path without "/admin" from the "../routes/admin" file
 */
app.use('/admin', adminRoutes);

// Register and use shop routes module in our application, which we defined in "../routes/shop"
app.use(shopRoutes);

// Routes for registration and login page
app.use(authRoutes);

// Adding a 404 Error Page (Page Not Found) with reference to the appropriate controller (errorController)
app.use(errorController.error);

// Execute MongoDB connection with a callback function that will get exexuted once we connected
mongoConnect(() => {
    app.listen(3000);
});