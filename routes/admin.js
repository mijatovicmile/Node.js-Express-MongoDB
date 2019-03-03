const express = require('express');
const router = express.Router();

// Products controller
const adminController = require('../controllers/admin');

// GET /admin/add-product
router.get('/add-product', adminController.getAddProducts);

// GET /admin/products
router.get('/products', adminController.getProducts);

// Define the POST request route, this method will occurs when user submit the form from admin/add-product page
router.post('/add-product', adminController.postAddProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

// Exports the Router module
module.exports = router;