const Product = require('../models/product');

// Get products controller (shop page)
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', { 
            pageTitle: 'All Products',
            // Create prods array and store product data into our template, so we can use and output it in the shop template
            prods: products,
            pageId: '/products'
        })
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { 
            pageTitle: 'Shop',
            // Create prods array and store product data into our template, so we can use and output it in the shop template
            prods: products,
            pageId: '/'
        })
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        // Create prods array and store product data into our template, so we can use and output it in the shop template
        pageId: '/cart'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        // Create prods array and store product data into our template, so we can use and output it in the shop template
        pageId: '/checkout'
    });
};