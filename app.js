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
// Import error controller, which we will use for Page Not Found (404)
const errorController = require('./controllers/error');


/**
 * Create an Express application and store it in a constant named app, by running express() as a function
 */
const app = express();

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
 * Parse incoming request bodies in a middleware before handlers, available under the req.body property.
 */
app.use(bodyParser.urlencoded({ extended: false }));

// 
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

// Adding a 404 Error Page (Page Not Found) with reference to the appropriate controller (errorController)
app.use(errorController.error);

const port = 3000;

app.listen(port, () => (`Example app listening on port ${port}!`));