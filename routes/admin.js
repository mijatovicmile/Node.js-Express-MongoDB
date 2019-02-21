const express = require('express');
const router = express.Router();

// Products controller
const productsController = require('../controllers/products');

// Define the GET request route for adding new product with reference to the products controller
router.get('/add-product', productsController.getAddProducts);

// Define the POST request route, this method will occurs when user submit the form from admin/add-product page
router.post('/add-product', productsController.postAddProducts);

// Exports the Router module
module.exports = router;