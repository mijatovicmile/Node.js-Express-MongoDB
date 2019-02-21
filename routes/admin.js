const express = require('express');
const router = express.Router();

// Create constant "products" where we will receive new products as an array
const products = [];

// Define the GET request route for adding new product
router.get('/add-product', (req, res, next) => {
  // Render add-product page
  res.render('add-product', { 
    // Display "Add Product" as a title of page (in the browser tab)
    pageTitle: 'Add Product',
    // Render a 'active' class on each of navigation links depending on which page we're on
    pageId: '/admin/add-product'
  });
})

// Define the GET request route for adding new product
router.get('/add-product', (req, res, next) => {

  res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="button" type="submit">Add Product</button></form>')

  res.render('add-product', { pageTitle: 'Add Product'});
  // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="button" type="submit">Add Product</button></form>')

})

// Define the POST request route, this method will occurs when user submit the form from admin/add-product page
router.post('/add-product', (req, res) => {
  // Push a new object (product title and description) into products array
  products.push({ 
    title: req.body.title,
    description: req.body.description 
  });
  // Redirects to the URL derived from the specified path (home page)
  res.redirect('/');  
});


// Exports the Router module
exports.router = router;

// Exports the Products module
exports.products = products;
