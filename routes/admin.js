const express = require('express');

// Create modular, mountable route handlers. A Router instance is a complete middleware and routing system
const router = express.Router();

// Admin controller
const adminController = require('../controllers/admin');

// Route to the /admin/add-product page where we will adding new products as admin
router.get('/add-product', adminController.getAddProducts);

// Route to the /admin/products page where we will listed of all products from database 
router.get('/products', adminController.getProducts);

// Define the POST request route, this method will occurs when user submit the form from admin/add-product page
router.post('/add-product', adminController.postAddProducts);

// Route for fetching the products that should be edited and for rendering it
router.get('/edit-product/:productId', adminController.getEditProduct);

// Route for edit product page which is responsible for saving changes to the database
router.post('/edit-product', adminController.postEditProduct);

// Define the POST request route for deleting product from database
router.post('/delete-product', adminController.postDeleteProduct);

// Exports the Router module
module.exports = router;