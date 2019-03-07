const Product = require('../models/product');
const Cart = require('../models/cart');
 
// Controller for fetching All products from database
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', { 
            pageTitle: 'All Products',
            prods: products,
            pageId: '/products'
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
                pageId: '/products' 
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
            pageId: '/'
        })
    })
    // Catch and log any potential error we might have
    .catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, quantity: cartProductData.quantity});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Cart',
                pageId: '/cart',
                products: cartProducts
            });
        })
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    })
    res.redirect('/cart');
}

exports.postDeleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        pageId: '/orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        pageId: '/checkout'
    });
};
