// File system module allows us to work with the file system on our computer
const fs = require('fs');
// Provide utilities for working with file and directory paths
const path = require('path');

// Define the path of the file where we will save our card data
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    // Object that represents our card in data folder
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            // Create a new cart object, which will have products that are an empty array and total price with default value of zero
            let cart = { products: [], totalPrice: 0 };
            // If the file does not exist yet and therefore we got no cart yet
            if (!err) {
                // Our cart will have to be created, otherwise we know that we will get an existing card
                cart = JSON.parse(fileContent);
            }
            // 
            /**
             * Analyze the cart => See if the product we're trying to add already exists
             * 
             * Loop for all the products and have a look at each of them and take check if the product ID
             * matches the ID of the product we try to add.
             */
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            /**
             * Find out where in old products was located (which position it had), which allows us to use
             * that index to replace the item in our card with new updated one
             */
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // If we got an existing product then we want to increase quantity ot that product.
            if (existingProduct) {
                // Take the all properties of existing product and add them to a new object
                updatedProduct = { ...existingProduct };
                // Increase quantity of existing product by one
                updatedProduct.quantity = updatedProduct.quantity + 1; 
                // First of all copy the old products from card, but now we'll not add updated product
                cart.products = [...cart.products];
                // But we'll overwrite existing product index, so at this position I will replace the element with my updated product
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                /**
                 * If we don't have existing product, and have new one, 
                 * id of that project will be equal to the ID we are getting as an argument,
                 * and quantity will be 1, because we just added one product
                 */
                updatedProduct = { id: id, quantity: 1 };
                /**
                 * Update the cart products
                 * 
                 * Spreading the existing products of the cart (array of all the old card products)
                 * Add the updated product as a new addional product if we are creating a product for the first time,
                 * however if we have an existing product, I don't want to add a new product, and instead of that I want
                 * to replace the old one, and to do that I need to find out where in my old products was located
                 * (and to do that I need to find out where in my old products is) 
                 */
                cart.products = [...cart.products, updatedProduct];
            }
            // The total price will always rise by the price of the product we added
            cart.totalPrice = cart.totalPrice + +productPrice;
            /**
             * Save our cart in "/data/path folder" in JSON format
             * @param {*} p previously defined path
             */
            fs.writeFile(p, JSON.stringify(cart), err => {
                // If we have some error while saving the cart
                console.log(err);
            })
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            } 
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.quantity;

            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                // If we have some error while saving the cart
                console.log(err);
            })
        })
    }

    static getCart(callback) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                callback(null);
            } else {
                callback(cart);
            }
        });
    }
};