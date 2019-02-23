const express = require('express');
const router = express.Router();

// Import Shop Controller
const shopController = require('../controllers/shop');

// Route to the shop (home) page
router.get('/', shopController.getIndex); 
// Route to the products page, when we click on the Products link in the navigation menu
router.get('/products', shopController.getProducts);
// Route to the shop cart
router.get('/cart', shopController.getCart);
// Route to the checkout page 
router.get('/checkout', shopController.getCheckout);

// Exports the shop router module, so we can use it on the another pages
module.exports = router;