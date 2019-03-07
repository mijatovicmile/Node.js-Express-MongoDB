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

// Controller for adding products to the database (POST method)
exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    /**
     * Initialize the product by passing the title, image, description and price of the product 
     * which we previously defined in our product constructor
     */
    const product = new Product(
        title, 
        image, 
        description, 
        price
    );
    // Save product to database
    product
        .save()
        .then(result => {
            // Save operation was successful and did successfully add a product into the 'products' collection
            console.log('Created Product'); 
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

// Controller for GET method - responsible for fetching the products that should be edited and for rendering it 
exports.getEditProduct = (req, res, next) => {
    // Check if url contains "edit" as query parameter
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    // Get the product ID as part of the URL
    const prodId = req.params.productId;
    // Find and fetch the fitting product by prodId
    Product.findById(prodId)
        .then(product => {
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
        })
        // Catch and log any potential error we might have
        .catch(err => {
            console.log(err);
        });
};

// Controller for POST method - edit product page which is responsible for saving changes to the database
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImage = req.body.image;
    const updatedDescription = req.body.description;

    /**
     * Create a new product constant by using Product constructor and Product class and passing the updated information
     * updatedTtile, updatedImage, updatedDescription, updatedPrice and also pass the product ID
     * 
     */
    const product = new Product(
        updatedTitle,
        updatedImage,
        updatedDescription,
        updatedPrice,
        prodId
    );
    // Update product in the database 
    product
        .save()
        .then(result => {
            console.log('Updated product'); 
            res.redirect('/admin/products');
        })
        // Catch and log any potential error we might have
        .catch(err => {
            console.log(err);
        })
};

// Controller for fetching and render all products on the /admin/products page
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', { 
            pageTitle: 'Admin Products',
            prods: products,
            pageId: '/admin/products'
        })
    })
    .catch(err => {
        console.log(err);
    });
};

// Controller for deleting product from database
exports.postDeleteProduct = (req, res, next) => {
    // Get the product ID as part of the URL
    const prodId = req.body.productId;
    // Delete product by product Id
    Product.deleteById(prodId)
        .then(() => {
            console.log('Destroyed product');
            // Redirect to the /admin/product page after deleting the product
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};
