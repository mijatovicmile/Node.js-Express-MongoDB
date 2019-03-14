// Import the Product model in our shop controller
const Product = require('../models/product');
 
// Controller for fetching All products from database
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', {  
            pageTitle: 'All Products',
            prods: products,
            pageId: '/products',
            // Pass the information whether the user is authenticated or not
            isAuthenticated: req.session.isLoggedIn
        })
    })
    // Catch and log any potential error we might have
    .catch(err => {
        console.log(err);
    });
};

// Controller for fetching a single product from database based on product Id
exports.getProduct = (req, res, next) => {
    // Get the product ID as part of the URL
    const productId = req.params.productId;
    // Use product model to find the filtered product
    Product.findById(productId)
        .then(product => {
            // Render the product detail page
            res.render('shop/product-detail', { 
                product: product,
                pageTitle: product.title,
                pageId: '/products',
                // Pass the information whether the user is authenticated or not
                isAuthenticated: req.session.isLoggedIn
            });
        })
        // Catch and log any potential error we might have
        .catch(err => {
            console.log(err); 
        });
};

// Controller for fetching all product from database on the Shop page
exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/index', { 
            pageTitle: 'Shop',
            prods: products,
            pageId: '/',
            // Pass the information whether the user is authenticated or not
            isAuthenticated: req.session.isLoggedIn
        })
    })
    // Catch and log any potential error we might have
    .catch(err => {
        console.log(err);
    });
};

// Controller for displaying the Cart items
exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                pageId: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                // Pass the information whether the user is authenticated or not
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err);
        })
};

// Controller for posting product to the cart and finding if that product is already inside of the cards
exports.postCart = (req, res, next) => {
    // Get my product id
    const productId = req.body.productId;
    // Find and fetch a product by product Id
    Product.findById(productId)
        // Product that I want to add to the cart 
        .then(product => {
            // User from user model
            return req.user.addToCart(product);
        })
        // Result of the update operation
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        // Catch and log any potential error we might have
        .catch(err => {
            console.log(err);
        });        
}

// Controller for deleting cart item from the cart
exports.postDeleteCartItem = (req, res, next) => {
    // Get my product id
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        // Catch and log any potential error we might have
        .catch(err => {
            console.log(err);
        })
};

// Controller for posting an order(s)
exports.postOrder = (req, res, next) => {
    req.user 
        .addOrder()
        .then(result => {
            res.redirect('/orders')
        })
        .catch(err => {
            console.log(err);
        })
};

// Controller for getting the orders
exports.getOrders = (req, res, next) => {
    req.user 
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                pageId: '/orders',
                orders: orders,
                // Pass the information whether the user is authenticated or not
                isAuthenticated: req.session.isLoggedIn
            });
        })
};
