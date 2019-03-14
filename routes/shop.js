const express = require('express');

const router = express.Router();

// Import Shop Controller
const shopController = require('../controllers/shop');

// Route to the shop (home) page
router.get('/', shopController.getIndex); 

// Route to the products page, when we click on the Products link in the navigation menu
router.get('/products', shopController.getProducts);

// Route to the product details page (details based on product Id)
router.get('/products/:productId', shopController.getProduct);

// Route to the shop cart - GET method
router.get('/cart', shopController.getCart);

// Route for shop cart - POST method
router.post('/cart', shopController.postCart);

// Route for deleting cart items - POST method
router.post('/delete-cart-item', shopController.postDeleteCartItem);

// Route for creating order - POST method
router.post('/create-order', shopController.postOrder);

// Route to the orders page - GET method
router.get('/orders', shopController.getOrders);

// Exports the shop router module
module.exports = router;