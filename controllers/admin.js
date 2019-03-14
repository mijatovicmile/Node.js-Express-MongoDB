// Import product model in our admin controller module
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
        editing: false,
        // Pass the information whether the user is authenticated or not
        isLoggedIn: req.session.isLoggedIn
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
        price,
        null, // when adding a new product, productId has value 'null', because we dont have that when creating a new product
        req.user._id
    );
     
    // Save product to database
    product
        .save()
        .then(result => {
            // Save operation was successful and did successfully add a product into the 'products' collection in our database
            console.log('Created Product'); 
            // Redirect to the admin products page 
            res.redirect('/admin/products');
        })
        // Catch and log any potential error we might have
        .catch(err => {
            console.log(err);
        });
};


// Controller for GET method - responsible for fetching the products that should be edited and for rendering it 
exports.getEditProduct = (req, res, next) => {
    // Check if url contains "edit" as query parameter
    const editMode = req.query.edit;

    // If we are not in edit mode (if the url does not contain 'edit' query when we try to edit some product)
    if(!editMode) {
        // Redirect to the home page (shop page)
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
                pageTitle: 'Edit Product',
                /**
                 * Render a 'active' class on each of navigation links depending on which page we're on
                 * We will render a 'active' class based on pageId
                 */
                pageId: '/admin/edit-product',
                editing: editMode,
                product: product,
                // Pass the information whether the user is authenticated or not
                isAuthenticated: req.session.isLoggedIn
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
     * Create a new product constant by using Product constructor and Product class and passing the updated 
     * product information
     * 
     * updatedTtile, updatedImage, updatedDescription, updatedPrice and also pass the product Id
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
    // Fetch all products from database
    Product.fetchAll()
    .then(products => {
        res.render('admin/products', { 
            pageTitle: 'Admin Products',
            prods: products,
            pageId: '/admin/products',
            // Pass the information whether the user is authenticated or not
            isAuthenticated: req.session.isLoggedIn
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
            // Redirect to the /admin/product page after deleting the product
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};