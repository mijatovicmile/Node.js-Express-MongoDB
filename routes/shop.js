const express = require('express');
const router = express.Router();

// Import Products controller
const productsController = require('../controllers/products');

// Route to the shop (home) page with reference to the products controller
router.get('/', productsController.getProducts); 

// Exports the shop router module, so we can use it on the another pages
module.exports = router;