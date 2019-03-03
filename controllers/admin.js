// Import product model in our controller
const Product = require('../models/product');

// Controller for get Add / Edit product page 
exports.getAddProducts = (req, res, next) => {
    res.render('admin/edit-product', {     
        // Display "Add Product" as a title of page (in the browser tab)
        pageTitle: 'Add Product',
        /**
         * Render a 'active' class on each of navigation links depending on which page we're on
         * We will render a 'active' class based on pageId
         */
        pageId: '/admin/add-product',
        editing: false
    });
};

// Post product controller
exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    // Push a new object (product title and description) into products array
    const product = new Product(null, title, image, description, price);
    product.save();

    // Redirects to the URL derived from the specified path (home page)
    res.redirect('/');  
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {     
            // Display "Edit Product" as a title of page (in the browser tab)
            pageTitle: 'Edit Product',
            /**
             * Render a 'active' class on each of navigation links depending on which page we're on
             * We will render a 'active' class based on pageId
             */
            pageId: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImage = req.body.image;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImage, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', { 
            pageTitle: 'Admin Products',
            // Create prods array and store product data into our template, so we can use and output it in the shop template
            prods: products,
            pageId: '/admin/products'
        })
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};