const express = require('express');
const router = express.Router();
const adminData = require('./admin');

// Route to the shop (home) page
router.get('/', (req, res, next) => {
    // Product array from admin panel
    const products = adminData.products;
    res.render('shop', { 
        pageTitle: 'Home page',
        // Create prods array and store product data into our template, so we can use and output it in the shop template
        prods: products,
        pageId: '/'
    })
});

// Exports the shop router module, so we can use it on the another pages
module.exports = router;