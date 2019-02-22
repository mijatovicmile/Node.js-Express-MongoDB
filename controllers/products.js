const products = [];
// Import product model in our controller
const Product = require('../models/product');

// Controller for get Add product page 
exports.getAddProducts = (req, res, next) => {
    res.render('add-product', {     
        // Display "Add Product" as a title of page (in the browser tab)
        pageTitle: 'Add Product',
        /**
         * Render a 'active' class on each of navigation links depending on which page we're on
         * We will render a 'active' class based on pageId
         */
        pageId: '/admin/add-product'
    });
};

// Post product controller
exports.postAddProducts = (req, res) => {
    // Push a new object (product title and description) into products array
    const product = new Product(req.body.title, req.body.description);
    product.save();

    // Redirects to the URL derived from the specified path (home page)
    res.redirect('/');  
};

// Get products controller (shop page)
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', { 
            pageTitle: 'Home page',
            // Create prods array and store product data into our template, so we can use and output it in the shop template
            prods: products,
            pageId: '/'
        })
    });
}
